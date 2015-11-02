///<reference path="IComparable.d.ts"/>
///<reference path="Primitive.d.ts"/>
/*
 * @author electricessence / https://github.com/electricessence/
 * Licensing: MIT https://github.com/electricessence/TypeScript.NET/blob/master/LICENSE.md
 */

import Type from './Types';
import isTrueNaN = Type.isTrueNaN;

export const enum CompareResult {
	Equal   = 0,
	Greater = 1,
	Less    = -1
}


// Used for special equals cases like NaN.
export function areEqual(a:any, b:any, strict:boolean = true):boolean
{
	return a===b || !strict && a==b || isTrueNaN(a) && isTrueNaN(b);
}

const COMPARE_TO = "compareTo";

export function compare<T>(a:IComparable<T>, b:IComparable<T>):number;
export function compare<T extends Primitive>(a:T, b:T, strict?:boolean):CompareResult;
export function compare(a:any, b:any, strict:boolean = true):CompareResult
{

	if(areEqual(a, b, strict))
		return CompareResult.Equal;

	if(a && Type.hasMember(a, COMPARE_TO))
		return a.compareTo(b);
	else if(b && Type.hasMember(b, COMPARE_TO))
		return -b.compareTo(a);

	// Allow for special inequality..

	if(a>b || strict && (a===0 && b==0 || a===null && b===undefined))
		return CompareResult.Greater;

	if(b>a || strict && (b===0 && a==0 || b===null && a===undefined))
		return CompareResult.Less;

	return NaN;
}
