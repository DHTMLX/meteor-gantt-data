Package.describe({
  name: "dhtmlx:gantt-data",
  version: "0.0.1",
  // Brief, one-line summary of the package.
  summary: "Meteor data adapter for dhtmlxGantt.",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/DHTMLX/meteor-gantt-data.git",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md",
  packages: {
      "dhtmlx:gantt": "*"
  }
});

Package.onUse(function(api) {
  api.versionsFrom("1.1.0.2");
  api.use("dhtmlx:gantt", "client");
  api.addFiles("gantt-data.js", "client");
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('dhtmlx:gantt');
  api.addFiles('gantt-data-tests.js');
});
