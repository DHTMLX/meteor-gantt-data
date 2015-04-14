Meteor data adapter for dhtmlxGantt
================================

Allows using [dhtmlxGantt](http://dhtmlx.com/docs/products/dhtmlxGantt) component with [Meteor](https://meteor.com/).

How to use
-----------

- Add the [dhtmlxGantt data adapter](https://atmospherejs.com/dhtmlx/gantt-data):

    ```sh
    meteor add dhtmlx:gantt-data
    ```

- Define data collections as usual:

    ```js
    TasksCollection = new Mongo.Collection("tasks");
    LinksCollection = new Mongo.Collection("links");
    ```

- Initialize dhtmlxGantt and data adapter:

    ```html
	<body>
	  <div id="gantt_here" style='width: 100%; height: 500px;'></div>
	</body>
    ```

    ```js
	Meteor.startup(function() {
	  //Init dhtmlxGantt.
	  gantt.init("gantt_here");

	  //Init dhtmlxGantt data adapter.
	  gantt.meteor({tasks: TasksCollection, links: LinksCollection});
	  //or
	  gantt.meteor(
	    {tasks: TasksCollection.find(/*[anything]*/), links: LinksCollection.find(/*[anything]*/)},
	    {tasks: TasksCollection, links: LinksCollection}
	  );
	});
    ```

That is it.

License
----------

DHTMLX is published under the GPLv3 license.

License:

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
	IN THE SOFTWARE.


Copyright (c) 2015 DHTMLX
