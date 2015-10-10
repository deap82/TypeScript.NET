'use strict';

// List of all tasks by name and for reuse as dependencies.
const
	TASK_TYPESCRIPT         = 'typescript',
	TASK_TYPESCRIPT_MIN     = 'typescript.min',
	TASK_TYPEDOC            = 'typedoc',
	TASK_VERSION_BUMP_MINOR = 'version-bump-minor',
	TASK_VERSION_BUMP_PATCH = 'version-bump-patch',
	TASK_CSHARP_TO_TS       = 'c-sharp-to-typescript',
	TASK_NUGET_PACK         = 'nuget-pack',
	TASK_DEFAULT            = 'default';

var gulp       = require('gulp'),
    del        = require('del'),
    rename     = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    typescript = require('gulp-typescript'),
    typedoc    = require('gulp-typedoc'),
    replace    = require('gulp-replace'),
    semver     = require('semver'),
    nugetpack  = require('gulp-nuget-pack');

const EVENT_END = 'end';
const DOCS = './documentation';

// Note: This is NOT a parser, just a step by step find replace.
gulp.task(
	TASK_CSHARP_TO_TS,
	function() {
		return gulp.src('./source/**/*.cs')

			// https://gist.github.com/electricessence/b575f18dc184beb5cc69
			.pipe(replace(/(\n\s*)namespace\s/g, '$1module '))

			.pipe(replace(/(\n\s*)using\s/g, '$1import '))

			.pipe(replace(/(\n\s*)#(region|endregion)\s/g, '$1// #$2 '))

			.pipe(replace(/\bpublic\s+(partial\s+)?class\b/g,'export $1class'))

			.pipe(replace(/class\s+(\w+)\s*\:\s*I(\w+)/g,'class $1 implements I$2'))

			.pipe(replace( // Convert member vars
				/((\b(public|internal|protected|private|static|unsafe|readonly|volatile|const)\b)+)\s+(\w+)\s+(\w\S*)(\s*([=][^=]|;))/g,
				'$1 $5:$4$6'
			))

			.pipe(replace(/(\n\s+)static\b/g, '$1private static'))

			.pipe(replace(/\b(out|ref)\b/g, '/*$1*/'))


			.pipe(replace( // Convert C# params to ECMA
				/([(,/]\s*)([^(), /*]+)\s+(\w+)\s*([,)])/g,
				'$1$3:$2$4'))
			.pipe(replace( // Convert methods
				/\b(?!else|if)(\w\S*)(\t| )+(\w\S*)\s*\(([^()]*)\)(\s*\n\s*\{)/g,
				'$2($3):$1 $4'
			))
			.pipe(replace( // Convert simple get
				/(\w+\s+)?(\w+\s+)(\w+)(\s|\n)*\{(\s|\n)*get(\s|\n)*(\{[^{}]*\})(\s|\n)*}/g,
				'$1 get $3():$2\n$7'
			))
			.pipe(replace( // Convert vars
				/(\n\s+|for\()(?!return|public|goto|import|throw|var)(\w+)(\[\])?\s+(\w\S*)(\s*([=][^=]|;))/g,
				'$1var $4:$2$3$5'
			))
			.pipe(replace( // Specify compiler integer
				/(\s*:\s*int\s*=\s*\d+)\s*([,;])/g,
				'$1 | 0$2'
			))
			.pipe(replace( // Convert bool to boolean
				/\b(bool|Boolean)\b/g,
				'boolean'
			))
			.pipe(replace( // Convert number casting
				/\((int|uint|short|ushort|long|ulong|float|double|decimal)\)/g,
				'<$1>'
			))
			.pipe(replace( // Convert number types.
				/( [^*<])(int|uint|short|ushort|long|ulong|float|double|decimal)\b/g,
				'$1number/*$2*/'
			))
			.pipe(replace( // Remove unnecessary public
				'public static',
				'static'
			))
			.pipe(replace( // Comment unsupported words
				/\b(internal|unsafe|readonly|volatile|partial)(\s+)/g,
				'/*$1*/$2'
			))
			.pipe(replace( //Passify throw new
				/\bthrow new ([^;]+);/g,
				"throw '$1';"))


			.pipe(rename({ extname: '.ts' }))
			.pipe(gulp.dest('./source'));
	}
);

gulp.task(
	// This renders the same output as WebStorm's configuration.
	TASK_TYPESCRIPT, function()
	{

		var options = {
			tscPath: './node_modules/typescript/bin/tsc',
			outDir: './source',
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true,
			sourceMap: true
		};

		// In order to mirror WebStorm's compiler option, gulp-tsc is used.
		return gulp
			.src(['./source/**/*.ts'])
			.pipe(require('gulp-tsc')(options))
			.pipe(gulp.dest('./source'))
			;
	}
)
;

gulp.task(
	TASK_TYPESCRIPT_MIN, function()
	{
		del(['./min/**/*']);

		var typescriptOptions/*:typescript.Params*/ = {
			noImplicitAny: true,
			module: 'amd',
			target: 'es5',
			removeComments: true
		};

		// This isn't ideal, but it works and points the maps to the original source.
		var sourceMapOptions/*:sourcemaps.WriteOptions*/ = {
			sourceRoot: function(file/*:VinylFile*/)/*:string*/
			{
				var count = (file.relative + '').split("\\").length;
				var result = '';
				for(var i = 1; i<count; i++)
				{
					result += '../';
				}
				return result + '../source/';
			},
			includeContent: false
		};

		var uglifyOptions = {
			preserveComments: 'license'
		};

		return gulp
			.src(['./source/**/*.ts'])
			.pipe(sourcemaps.init())
			.pipe(typescript(typescriptOptions))
			.pipe(uglify(uglifyOptions))
			.pipe(sourcemaps.write('.', sourceMapOptions))
			.pipe(gulp.dest('./min'));

	});


gulp.task(
	TASK_TYPEDOC, function(done)
	{
		var typedocOptions = {
			name: 'TypeScript.NET',
			out: './documentation',

			module: 'amd',
			target: 'es5',

			includeDeclarations: true,
			ignoreCompilerErrors: false,
			version: true,
			excludeNotExported: true
		};

		// Step 1: Render type-docs..
		console.log('TypeDocs: rendering');
		return gulp
			.src('source')
			.pipe(typedoc(typedocOptions))
			.on(EVENT_END, typedocFixes);


		function typedocFixes()
		{

			// Step 2-A: Fix for issue with search that places a [BACK-SLASH] instead of a [SLASH].
			console.log('TypeDocs: applying fixes');
			const SEARCH_FOLDER = DOCS + '/assets/js';
			gulp
				.src(SEARCH_FOLDER + '/search.js')
				.pipe(replace('\\\\', '/'))
				.pipe(replace('/_', '/'))
				.pipe(gulp.dest(SEARCH_FOLDER));

			// Step 2-B: Refactor (rewrite) html files.
			gulp.src(DOCS + '/**/*.html')
				.pipe(replace('/_', '/'))
				.pipe(replace(' href="_', ' href="'))
				.pipe(rename(function(path)
				{
					path.basename = path.basename.replace(/^_/, '');
				}))
				.pipe(gulp.dest(DOCS))
				.on(EVENT_END, cleanup);

		}

		function cleanup()
		{
			// Step 3: Delete all old underscored html files.
			del.sync(DOCS + '/**/_*.html', function()
			{
				console.log('TypeDocs: fixes complete');
				done();
			});
		}

	});

/**
 * @param {string} type
 * @returns {NodeJS.ReadableStream}
 */
function bumpVersion(type)
{
	// No tsd yet.
	var fs   = require('fs'),
	    bump = require('gulp-bump');

	var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
	// increment version
	var newVer = semver.inc(pkg.version, type);

	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({ version: newVer }))
		.pipe(gulp.dest('./'));

}

gulp.task(TASK_VERSION_BUMP_PATCH, function() { bumpVersion('patch'); });

gulp.task(TASK_VERSION_BUMP_MINOR, function() { bumpVersion('minor'); });


gulp.task(TASK_NUGET_PACK,
	[
		TASK_TYPESCRIPT,
		TASK_TYPESCRIPT_MIN
	],
	function(callback) {

		const CONTENT = '/content';

		var fs = require('fs');

		var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
		nugetpack({
				id: "TypeScript.NET.AMD",
				title: pkg.name,
				version: pkg.version,
				authors: "https://github.com/electricessence/",
				description: pkg.description,
				summary: "See http://electricessence.github.io/TypeScript.NET/ for details.",
				language: "en-us",
				projectUrl: "https://github.com/electricessence/TypeScript.NET",
				licenseUrl: "https://raw.githubusercontent.com/electricessence/TypeScript.NET/master/LICENSE.md",
				tags: "typescript tsc .NET TypeScript.NET LINQ",
				excludes: ["js/**/*.dev.js"],
				outputDir: ".nuget"
			},

			[
				'source',
				'min',
				'*.json',
				'*.md'
			],

			callback
		);
	});


gulp.task(TASK_DEFAULT, [
	TASK_TYPESCRIPT,
	TASK_TYPESCRIPT_MIN,
	TASK_TYPEDOC
]);