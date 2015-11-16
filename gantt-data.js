var gObserversCollection = null,
    gEventsCollection = null;

function meteorStart(collections) {
    gObserversCollection = new DataCollection();
    gEventsCollection = new DataCollection();

    var collectionsCursors = {
        tasks: null,
        links: null
    };

    if(arguments.length == 2) {
        collectionsCursors = arguments[0];
        collections = arguments[1];
    }
    else {
        collectionsCursors["tasks"] = collections["tasks"].find();
        collectionsCursors["links"] = collections["links"].find();
    }

    initCollectionHandler(this, collections["tasks"], collectionsCursors["tasks"], "task");
    initCollectionHandler(this, collections["links"], collectionsCursors["links"], "link");

};

function meteorStop() {
    if(gObserversCollection) {
        gObserversCollection.each(function(observer) {
            observer.stop();
        });
    }

    var self = this;
    if(gEventsCollection) {
        gEventsCollection.each(function(eventId) {
            self.detachEvent(eventId);
        });
        gEventsCollection.clean();
    }
};

function initCollectionHandler(gantt, collection, collectionCursor, itemType) {
    var itemTypeSettings = getItemTypeSettings(gantt, itemType),
        eventsNames = itemTypeSettings.events_names;

    var collectionHandlerObj = new CollectionHandler(collection);

    gEventsCollection.add(gantt.attachEvent("onTaskLoading", function(task) {
        collectionHandlerObj.save(task);
        return true;
    }));

    gEventsCollection.add(gantt.attachEvent(eventsNames.added, function(itemId, item) {
        collectionHandlerObj.save(item);
    }));

    gEventsCollection.add(gantt.attachEvent(eventsNames.updated, function(itemId, item) {
        collectionHandlerObj.save(item);
    }));

    gEventsCollection.add(gantt.attachEvent(eventsNames.removed, function(itemId) {
        collectionHandlerObj.remove(itemId);
    }));

    var methods = itemTypeSettings.methods;
    gObserversCollection.add(collectionCursor.observe({

        added: function(data) {
            var itemData = parseItemData(data);
            if(!methods.isExists(itemData.id))
                methods.add(itemData);
        },

        changed: function(data) {
            var itemData = parseItemData(data);

            if(!methods.isExists(itemData.id))
                return false;

            var item = methods.get(itemData.id);
            for(var key in itemData)
                item[key] = itemData[key];

            methods.update(itemData.id);
            return true;
        },

        removed: function(data) {
            if(methods.isExists(data.id))
                methods.remove(data.id);
        }

    }));

}

function getItemTypeSettings(gantt, itemType) {
    var methods = {
        isExists: function() {},
        get: function() {},
        add: function() {},
        update: function() {},
        remove: function() {}
    },
    eventsNames = {
        added: "",
        updated: "",
        removed: ""
    };

    function isExistsItem(itemId) {
        return (itemId != null);
    }

    switch(itemType) {
        case "task":
            methods.isExists = function(taskId) {return (isExistsItem(taskId) && gantt.isTaskExists(taskId))};
            methods.get = gantt.getTask;
            methods.add = gantt.addTask;
            methods.update = gantt.updateTask;
            methods.remove = gantt.deleteTask;
            eventsNames.added = "onAfterTaskAdd";
            eventsNames.updated = "onAfterTaskUpdate";
            eventsNames.removed = "onAfterTaskDelete";
            break;

        case "link":
            methods.isExists = function(linkId) {return (isExistsItem(linkId) && gantt.isLinkExists(linkId))};
            methods.get = gantt.getLink;
            methods.add = gantt.addLink;
            methods.update = gantt.updateLink;
            methods.remove = gantt.deleteLink;
            eventsNames.added = "onAfterLinkAdd";
            eventsNames.updated = "onAfterLinkUpdate";
            eventsNames.removed = "onAfterLinkDelete";
            break;
    }

    for(var method in methods)
        methods[method] = methods[method].bind(gantt);

    return {methods: methods, events_names: eventsNames};
}

function CollectionHandler(collection) {

    this.save = function(item) {
        item = parseItemData(item);

        var savedItemData = this.findItem(item.id);
        if(savedItemData)
            collection.update({_id: savedItemData._id}, { $set: item});
        else
            collection.insert(item);
    };

    this.remove = function(itemId) {
        var savedItemData = this.findItem(itemId);
        if(savedItemData)
            collection.remove(savedItemData._id);
    };

    this.findItem = function(itemId) {
        return collection.findOne({id: itemId});
    };
}

function parseItemData(item) {
    var itemData = {};
    for(var itemProperty in item) {
        if((itemProperty == "_id") || (itemProperty.charAt(0) == "$"))
            continue;

        itemData[itemProperty] = item[itemProperty];

        if(itemProperty == "id")
            itemData[itemProperty] = itemData[itemProperty].toString();
    }

    return itemData;
}

function DataCollection() {
    var collectionData = {},
        currentUid = new Date().valueOf();

    function _uid() {
        return currentUid++;
    }

    this.add = function(data) {
        var dataId = _uid();
        collectionData[dataId] = data;
        return dataId;
    };

    this.each = function(handler) {
        for(var key in collectionData)
            handler.call(this, collectionData[key]);
    };

    this.clean = function() {
        collectionData = {};
    };
}



function initGanttMeteor(gantt) {
    gantt.meteor = meteorStart;
    gantt.meteorStop = meteorStop;
}

if(window.Gantt) {
    Gantt.plugin(function(gantt) {
        initGanttMeteor(gantt);
    });
}
else
    initGanttMeteor(gantt);
