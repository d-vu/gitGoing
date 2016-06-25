import { connect } from 'react-redux';
import * as getBranches from '../actions/getBranches.js';
import * as getCommits from '../actions/getCommits.js';
import * as user from '../actions/user.js'; 
import * as ui from '../actions/ui.js';
import BranchingView from '../components/BranchingView.jsx';
import * as debug from '../actions/debugMode.js';

const mapStatetoProps = function (state) {
  const { user, branches, commits, room, ui } = state;
  return {
    user,
    branches,
    commits,
    room,
    ui
  };
};

const mapDispatchtoProps = function(dispatch) {
	return {
		getUser: function() {
		  dispatch(user.get());
		},
		getBranches: function(roomid) {
		  dispatch(getBranches.get(roomid));
		},
		getCommits: function(roomid){
			dispatch(getCommits.get(roomid));
		},
    showBranches: function(display) {
      dispatch(ui.showBranches(display));
    },
    showCommits: function(display) {
      dispatch(ui.showCommits(display));
    },
    showFileStructure: function(display) {
      dispatch(ui.showFileStructure(display));
    },
    debugModeOn: function() {
      dispatch(debug.on());
    }
	};
};

export default connect(mapStatetoProps, mapDispatchtoProps)(BranchingView);


