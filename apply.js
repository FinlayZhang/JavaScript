var value = 2;
var foo = {
	value: 1
};
// call模拟实现
Function.prototype.call2 = function (context) {
	context = context || window;
	// 首先要获取调用call的函数,用this可以获取
	context.fn = this;
	var args = [];
	var len = arguments.length;
	for (var i = 1; i < len; i++) {
			args.push('arguments[' + i + ']');
	}
	var result = eval('context.fn(' + args + ')');
	delete context.fn;
	return result;
}

function bar(name, num, say) {
	return {
		value: this.value,
		name: name,
		num: num,
	}
}
// 测试call函数
var callRes = bar.call2(foo, 'hahaha', 666, 'memeda');
// console.log(callRes);

// apply模拟实现
Function.prototype.apply2 = function (context, arr) {
	context = context || window;
	// 首先要获取调用apply的函数,用this可以获取
	context.fn = this;
	var result;
	// 如果第二个参数不是数组,直接执行
	if (!arr) {
		result = context.fn();
	} else {
		var args = [];
		for (var i = 0, len = arr.length; i < len; i++) {
			args.push('arr[' + i + ']');
		}
		result = eval('context.fn(' + args + ')')
	}
	delete context.fn
	return result;
}

function bar2() {
	return {
		value: this.value,
	}
}

// 测试apply函数
var applyRes = bar2.apply2(foo, ['a', 'b', 'c', 'd', 'e']);
// console.log(applyRes);

// bind模拟实现
// bind函数的特点是返回一个函数,参数可以在bind的时候和执行返回的函数的时候传递
// bind函数还可以new,new之后this绑定失效,但传递的参数生效
Function.prototype.bind2 = function (context) {
	if (typeof this !== "function") {
		throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
	}
	context = context || window;
	// 获取this
	var self = this;
	// 获取bind2函数从第二个参数到最后一个参数
	var args = Array.prototype.slice.call(arguments, 1);
	// 空函数
	var fbound = function () {
		// 这个时候的arguments是指bind返回的函数传入的参数
		var returnBindFunArgs = Array.prototype.slice.call(arguments);
		// 当作为构造函数时,this指向实例,self指向绑定函数,因为下面一句Object.create(this.prototype)
		// 已经修改了fbound.prototype为绑定函数的prototype,此时结果为true,当结果为true的时候,this指向实例
		// 当作为普通函数时,this指向window,self指向绑定函数,此时结果为false,当结果为 false 的时候,this指向绑定的context
		self.apply(this instanceof self ? this : context, args.concat(returnBindFunArgs));
	}
	// 修改返回函数的prototype为绑定函数的prototype,实例就可以继承函数的原型中的值
	fbound.prototype = Object.create(this.prototype);
	return fbound;
}

function bar3(name, age) {
	console.log(this.value, name, age);
}

bar3.prototype.friend = 'kevin';
bar3.bind2(foo, 'bind无new', '1')();
var bindFoo = bar3.bind(foo, 'bind有new');
new bindFoo('2');

// new模拟实现
function Otaku(name, age) {
	this.name = name;
	this.age = age;
	this.habit = 'Games';
}

Otaku.prototype.strength = 60;
Otaku.prototype.sayYourName = function () {
	console.log('I am ' + this.name);
}

function objectFactory(constructor) {
	var res = {};
	res.__proto__ = constructor.prototype;
	var ret = constructor.apply(res, Array.prototype.slice.call(arguments, 1));
	if (typeof constructor === 'object' || typeof constructor === 'function') {
		return ret;
	}
	return res;
};
var person = objectFactory(Otaku, 'Kevin', '18');
// console.log(person);
