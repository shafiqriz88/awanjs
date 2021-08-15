# Awan.js

Author - Shafiq Rizwan


## Introduction

Awan is a progressive javascript framework aimed for building web-based mobile app interfaces. Awan is designed to fuse Javascript and HTML with instead of two separate blocks and works by rendering inline Javascript with an intuitive templating style.

## Getting started

Include Awan.js in your html like below

```
<script src="awan.js"></script>
```

Being a mobile framework, Awan provides a basic CSS library which is required. This small CSS library provides some best practices for the mobile web realm such as high FPS page transitions and disabling regular web-ish user interactions behavor. Using utility css frameworks like Tailwind.css is highly recommended for a much rapid application development and ease of managing UI states. 

```
<link rel="stylesheet" href="awan.css" />
```

It is recommended to load these libraries just before the `</body>` closing tag.

## Hello World

This is how you can demonstrate a simple 'Hello World' in Awan.js

```html
<div class="page" id="main">

       Hello {{ app.name }}!
       <button onclick="app.name = 'Awan'">Click Me</button>

</div>
<script>
    let app = { name: 'World' }
    awan.init()
</script>
```

## Structure
Awan defines user views as pages in which is declared by using `class="page"` attribute to an element, `<div>` recommended.  Page with `id="main"` would be rendered at initialization while other pages are stored as virtual DOM.

**Basic structure with navigation**

```html
    <html>
	<head>
		<title>Awan.js Demo</title>
		<link rel="stylesheet" href="css/awan.css" />
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.0.3/tailwind.min.css" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div class="page page-no-title" id="main">
			<div class="page-content p-5 text-center">
				<div class="p-5">This is main page</div>
				<button class="bg-blue-500 text-white rounded p-2" onclick="go('#login')">Go to login page</button>
			</div>
		</div>
		
		<div class="page" id="login">
			<titlebar>
				<div class="inner">
					<div class="left"></div>
					<div class="title">Login</div>
					<div class="right"></div>
				</div>
			</titlebar>
			<div class="page-content">
				<div class="p-5 text-center">
					<div class="pb-2">
						<button class="bg-blue-500 text-white rounded p-2" onclick="go('#register')">Go to register page</button>
					</div>
					<div class="pb-2">
						<button class="bg-blue-500 text-white rounded p-2" onclick="go('#main', true)">Back to main page</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="page" id="register">
			<titlebar>
				<div class="inner">
					<div class="left"></div>
					<div class="title">Register</div>
					<div class="right"></div>
				</div>
			</titlebar>
			<div class="page-content">
				<div class="p-5 text-center">
					<button class="bg-blue-500 text-white rounded p-2" onclick="go('#login', true)">Back to login page</button>
				</div>
			</div>
		</div>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
		<script src="js/awan.js"></script>
		<script>
			let app = { 
				todo: [
					{task: 'clean desk', done: false},
					{task: 'buy groceries', done: false},
					{task: 'repair bicycle', done: false}
				]
			}
			awan.init();
		</script>
	</body>
</html>
```
**Output**
![demo](https://i.ibb.co/SQwLJLx/ezgif-3-e3823b78dfbf.gif)

This is to demonstrate an app with three pages and buttons that navigates between them. Every `onclick` event has a  built-in `go(page, isBack)` method that handles page transition and navigation -- details can be found in the **API section**. Apart from `class="page"`, Awan.js has several reserved tags and classes that are core to Awan.js and should not conflict with your own tags and classes. 



Reserved Tags/Classes|Description
---------------------|-----------
`<titlebar>`|Page title bar
`<titlebar> > div.inner`|Flex placeholder for containers
`<titlebar> > div.left`|Title bar left container used for toolbar or navigation buttons
`<titlebar> > div.title`|Title center container
`<titlebar> > div.right`|Title bar right container similar to left container
`[loop=]`|Loop container that will render iteration based on `loop` attribute
`.page`|Page screen
`.page-content`|Scrollable content page
`.page-no-title`|Page without titlebar
`.page-current`|Current page screen - used programmatically by Awan.js

## Inline expressions and rendering

Inline expression in Awan.js does not belong to any scope and therefore can access all objects and methods declared globally. This is to provide flexibility to developers to design their app according to taste. While it may raise concerns on vulnerability, Awan.js is focused towards closed environment container like [Cordova](http://cordova.apache.org).  where users do not have access to a browser console.


##### Example 1:

**Basic inline expression**

```html
<div class="page" id="main">
    	<div>A = {{ app.a }}</div>
    	<div>B = {{ app.b }}</div>
		<div>{{ app.a + app_b }}<div>
</div>
<script>
    let app = { a: 1, b: 2 }
    awan.init()
</script>
```

**Output**
>A = 1
>B = 2 
>3


The inline code `{{ expression }}` is rendered to its return value



##### Example 2:

**Setting values in expression**

```html
<div class="page" id="main">
	<div>C = {{ app.c = app.a + app.b }}<div>
	<div>{{ app.c }}</div>
</div>
<script>
    let app = { a: 1, b: 2, c: 0 }
    awan.init()
</script>
```
**Output**
>C = 3
>3

Set expression is also rendered to its evaluated value


##### Example 3: 

**Using inline expression to manipulate HTML elements**

```html
<div class="page" id="main">

	Items in cart 
	<span style="font-weight: {{ app.cart.length > 0 ? 'normal' : 'bold' }} ">{{ app.cart.length }}</span>

</div>
<script>
    let app = { cart: [] }
    awan.init()
</script>
```
**Output**
>Items in cart **0**

Set expression is also rendered to its evaluated value

##### Example 4
**Using utility function as helper**


```html
<div class="page" id="main">

	Your cart total is {{ strCurrency(app.cartTotal) }}

</div>
<script>
    let app = { cartTotal: 2.5 }
    awan.init()
    
    const strCurrency = function(amount){
    	return '$'+amount.toFixed(2);
    }
</script>
```
**Output**
>Your cart total is $2.50

## Loops

The most vital and somewhat tedious to do in HTML & Javascript is now much simpler to implement using `loop=""` attribute.


```html
<div class="page" id="main">
	
	You have {{ count = app.cart.length }} {{ strPlural(count,'item','items') }}

    <div loop="app.cart as item">
    	{{ item.name }} - {{ strCurrency(item.price) }}
    </div>
</div>
<script>
    let app = {
    	cart: [
    		{name: 'Pencil', price: 0.5},
    		{name: 'Book', price: 2.5}
    	]
    }
    awan.init();
    
    const strPlural = function(n, singular, plural){
    	return n > 1 ? plural : singular;
    }
    
    const strCurrency = function(amount){
    	return '$'+amount.toFixed(2);
    }
</script>
```

**Output**
> You have 2 items
> Pencil - $0.50
> Book - $2.50



## User inputs, events and data binding

Awan.js simplifies event handling and data binding to input elements like `<input>`, `<textarea>` and `<select>` where it can bind the value of those inputs to an object or variable. Events `onchange`, `onclick` and `onblur` will trigger the page to render again with the object current state and values.

##### Example 1
**Basic data binding**
```html
<div class="page" id="main">
    	<div>
	    	<input type="text" bind="app.user" />
    	</div>
		My name is {{ app.user }}
</div>
<script>
    let app = { user: 'John Doe' }
    awan.init()
</script>
```

**Output**
![output](https://i.ibb.co/R2qrXXw/ezgif-7-e95844de008e.gif)

##### Example 2
**Data binding in loop**
```html
<div class="page" id="main">
			
			<div loop="app.todo as item">
				<div style="padding: 5px">
					<input type="checkbox" bind="item.done" value="1" />
					<input type="text" bind="item.task" />
				</div>
			</div>
			
			<h1>My List</h1>
			
			<div loop="app.todo as item">
				<div style="padding: 5px; {{ item.done ? 'text-decoration: line-through' : '' }}">
					{{ item.task }}
				</div>
			</div>
			
			<button onclick="app.todo.push({task: 'new task', done: false})">Add Item</button>
			
		</div>
		<script>
			let app = { 
				todo: [
					{task: 'clean desk', done: false},
					{task: 'buy groceries', done: false},
					{task: 'repair bicycle', done: false}
				]
			}
			awan.init();
		</script>
```

**Output**
![data binding loop](https://i.ibb.co/4gsJMyd/ezgif-3-796ebcefe593.gif)















