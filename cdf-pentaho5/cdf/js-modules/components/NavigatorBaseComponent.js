/*!
 * Copyright 2002 - 2014 Webdetails, a Pentaho company.  All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

define(['../Logger', './BaseComponent'], function(Logger, BaseComponent) {

  var NavigatorBaseComponent = BaseComponent.extend({},{
    path: this.dashboard.getQueryParameter("path"),

    solution: this.dashboard.getQueryParameter("solution"),

    template: this.dashboard.getQueryParameter("template"),

    navigatorResponse : -1,

    getSolutionJSON : function(solution) {
      var json = NavigatorBaseComponent.navigatorResponse;
      var files = json.solution.folders;
      var locationArray;

      var found = 0;
      for(i = 0; i<files.length; i++) {
        var file = files[i];
        if(NavigatorBaseComponent.solution == ""
          || file.solution == NavigatorBaseComponent.solution) {

          var solutionFiles = [];

          // Process subFolders;
          var subFolders = file.folders;
          if(subFolders != undefined && subFolders.length == undefined) {
            // only one folder inside
            solutionFiles.push(subFolders);
          } else if(subFolders != undefined && subFolders.length > 0) {
            // We have an array of files
            solutionFiles = solutionFiles.concat(subFolders);
          }

          // Process subFiles;
          var subFiles = file.files;
          if(subFiles != undefined && subFiles.length == undefined) {
            // only one file inside
            solutionFiles.push(subFiles);
          } else if(subFiles != undefined && subFiles.length > 0) {
            // We have an array of files
            solutionFiles = solutionFiles.concat(subFiles);
          }

          return solutionFiles;
        }

      }
      if(found == 0) {
        Logger.error("Fatal: Solution " + solution +" not found in navigation object");
        return;
      }
    },

    browseContent : function(files, currentPath) {

      for(var i = 0; i<files.length; i++) {
        var file = files[i];
        //console.log("Searching for " + currentPath + ", found " + file.path);
        if(file.type == "FOLDER" && file.path == currentPath) {
          files = file.folders;
          /*
           console.log("Files found for this path:");
            for (var j = 0; j < files.length; j++) {
              if (files[j].path != undefined) {
                console.log(files[j].path);
              }
            }
          */
          if(files == undefined) {
            return [];
          }
          if(files.length == undefined) {
            files = [ files ];
          }
          return files;
        }

      }
      Logger.error("Fatal: path " + (NavigatorBaseComponent.path || this.dashboard.getPathParameter()) + " not found in navigation object");
      return;
    },

    getParentSolution : function() {
      if((NavigatorBaseComponent.path || this.dashboard.getPathParameter()).length>0) {
        return NavigatorBaseComponent.solution;
      } else {
        return "";
      }
    },

    getParentPath : function() {
      var path = NavigatorBaseComponent.path || this.dashboard.getPathParameter();
      var index = path.lastIndexOf("/");
      if(index==-1) {
        return "";
      }
      var parentPath = path.substring(0, path.lastIndexOf("/"));
      return parentPath;
    },

    isAncestor : function(solution, path) {
      if(solution != NavigatorBaseComponent.solution) {
        return false;
      } else {
        return true;
      }
    }
  });

  return NavigatorBaseComponent;

});
