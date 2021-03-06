import _ from 'underscore';
import { DEBUG_MODE_ON, DEBUG_MODE_OFF } from './actions/debugMode.js';
import { FETCH_ERROR, JSON_PARSE_ERROR } from './actions/fetchHelper.js';
import { USER_GET_REQUEST, USER_GET_RESPONSE } from './actions/user.js';
import { REPO_GET_REQUEST, REPO_GET_RESPONSE } from './actions/getRepos.js';
import { BRANCHES_GET_REQUEST, BRANCHES_GET_RESPONSE } from './actions/getBranches.js';
import { COMMIT_GET_REQUEST, COMMIT_GET_RESPONSE } from './actions/getCommits.js';
import { ROOM_POST_RESPONSE, ROOM_GET_RESPONSE } from './actions/room.js';
import { SHOW_BRANCHES, SHOW_COMMITS, SHOW_FILE_STRUCTURE, UPDATE_EDITOR} from './actions/ui.js';
import { FILETREE_GET_REQUEST, FILETREE_GET_RESPONSE } from './actions/getFileTree.js';
import { FILE_GET_REQUEST, FILE_GET_RESPONSE, FILE_POST_REQUEST, FILE_POST_RESPONSE } from './actions/file.js';
import { CONNECT_ROOM_START, CONNECT_ROOM_END } from './actions/socket';
import io from 'socket.io-client';
import { ROOMS_GET_REQUEST, ROOMS_GET_RESPONSE } from './actions/getAllRooms.js';
import { FILETREE_RECURSIVE_GET_REQUEST, FILETREE_RECURSIVE_GET_RESPONSE } from './actions/getFileTreeRecursively.js';


export const debugMode = function(state=false, action) {
  switch (action.type) {
    case DEBUG_MODE_ON:
      return true;
    case DEBUG_MODE_OFF:
      return false;
    case FETCH_ERROR:
      console.log('FETCH_ERROR: ' + action.error);
      return state;
    case JSON_PARSE_ERROR:
      console.log('JSON_PARSE_ERROR: ' + action.error);
      return state;
    default:
      !state || console.log('ACTION DISPATCHED:', action.type);
      return state;
  }
};

export const user = function (state={}, action) {
  switch (action.type) {
    case USER_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const repos = function(state=[], action){
  switch (action.type) {
    case REPO_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const branches = function(state=[], action){
  switch (action.type) {
    case BRANCHES_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const commits = function(state=[], action){
  switch (action.type) {
    case COMMIT_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const room = function(state={}, action) {
  switch (action.type) {
    case ROOM_GET_RESPONSE:
      return action.data;
    case ROOM_POST_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

var intialUiState = {
  sidebarView: 'branches',
  sidebarStack: [],
  editorText: '',
};

export const ui = function(state= intialUiState, action){
  switch (action.type) {
    case SHOW_BRANCHES:
      return Object.assign({}, state, {
        sidebarView: action.display,
        sidebarStack: state.sidebarStack.concat([action]),
        stackLength: state.sidebarStack.length
      });
    case SHOW_COMMITS:
      return Object.assign({}, state, {
        sidebarView: action.display,
        sidebarStack: state.sidebarStack.concat([action]),
        currentBranchName: action.branchName || state.currentBranchName
      });
    case SHOW_FILE_STRUCTURE:
      return Object.assign({}, state, {
        sidebarView: action.display,
        sidebarStack: state.sidebarStack.concat([action]),
        currentCommitSha: action.commitSha,
        stackLength: state.sidebarStack.length
      });
    case UPDATE_EDITOR:
      return Object.assign({}, state, {
        editorText: action.fileContent,
        stackLength: state.sidebarStack.length
      });
    case FILE_GET_RESPONSE:
      return Object.assign({}, state, {
        currentFileSha: action.data.sha,
        currentFilePath: action.data.path,
        editorText: action.data.content
      });
    default:
      return state;
  }
};


export const fileTree = function (state=[], action) {
  switch (action.type) {
    case FILETREE_GET_RESPONSE:
      var returnArr = [];
      for (var i = 0; i < action.data.tree.length; i++) {
        action.data.tree[i].depth = 0;
        action.data.tree[i].icon = false;
        action.data.tree[i].visible = true;
        action.data.tree[i].absolutePath = action.data.tree[i].path;
        returnArr.push(action.data.tree[i]);
      }
      return Object.assign({}, state, {
        fileData: returnArr
      });
    case FILETREE_RECURSIVE_GET_RESPONSE:
      for (var j = 0; j < state.fileData.length; j++) {
        if (state.fileData[j].sha === action.data.sha) {
          var currentDepth = state.fileData[j].depth;
          for (var k = 0; k < action.data.tree.length; k++) {
            action.data.tree[k].depth = currentDepth + 1;
            action.data.tree[k].icon = false;
            action.data.tree[k].visible = true;
            action.data.tree[k].absolutePath = state.fileData[j].absolutePath.concat('/', action.data.tree[k].path);
          } 
          state.fileData.splice(j+1, 0, action.data.tree);
          break;
        } else {
          continue;
        }
      }
      return Object.assign({}, state, {
        fileData: _.flatten(state.fileData)
      });
    default:
      return state;  
  }
};

export const file = function(state={}, action) {
  switch (action.type) {
    case FILE_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const socket = function(state={}, action) {
  switch (action.type) {
    case CONNECT_ROOM_START:
      console.log('from the socket action', action);
      return Object.assign({},state, {
        connection: io()
      });
    default:
      return state;
  }
};

export const allRooms = function (state=[], action) {
  switch (action.type) {
    case ROOMS_GET_RESPONSE:
      return action.data;
    default:
      return state;
  }
};

export const notifications = function (state={queue:[]}, action) {
  switch (action.type) {
    case USER_GET_RESPONSE:
      return Object.assign({}, state, {
        queue: state.queue.concat({user: action.status})
      });
    case REPO_GET_RESPONSE: 
      return Object.assign({}, state, {
        queue: state.queue.concat({repos: action.status})
      });
    case FILE_POST_RESPONSE:
      console.log('file post response action is', action.status);
      console.log('state now is', state);
      return Object.assign({}, state, {
        queue: state.queue.concat({commitStatus: action.status})
      });
    default:
      return state;
  }
};
