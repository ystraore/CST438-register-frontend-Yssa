import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js'
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddCourse from './AddCourse';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

// properties year, semester required
//  
//  NOTE: because SchedList is invoked via <Route> in App.js  
//  props are passed in props.location

class SchedList extends Component {
  constructor(props) {
    super(props);
    this.state = { courses: [] };
  } 
  
  componentDidMount() {
    this.fetchCourses();
  }
  
  fetchCourses = () => {
    console.log("SchedList.fetchCourses");
    const token = Cookies.get('XSRF-TOKEN');
    
    fetch(`${SERVER_URL}/schedule?year=${this.props.location.year}&semester=${this.props.location.semester}`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => {
      console.log("FETCH RESP:"+response);
      return response.json();}) 
    .then((responseData) => { 
      // do a sanity check on response
      if (Array.isArray(responseData.courses)) {
        this.setState({ 
          courses: responseData.courses,
        });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => {
      toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err); 
    })
  }

  // Drop Course 
  onDelClick = (id) => {
    if (window.confirm('Are you sure you want to drop the course?')) {
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL} schedule/${id}`,
        {
          method: 'DELETE',
          headers: { 'X-XSRF-TOKEN': token }
        })
    .then(res => {
        if (res.ok) {
          toast.success("Course successfully dropped", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Course drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Delete http status =' + res.status);
    }})
      .catch(err => {
        toast.error("Course drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      }) 
    } 
  }

  // Add course
  addCourse = (course) => {
    const token = Cookies.get('XSRF-TOKEN');
 
    fetch(`${SERVER_URL}/schedule`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json',
                   'X-XSRF-TOKEN': token  }, 
        body: JSON.stringify(course)
      })
    .then(res => {
        if (res.ok) {
          toast.success("Course successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchCourses();
        } else {
          toast.error("Error when adding", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }})
    .catch(err => {
      toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
    })
  } 

  render() {
     const columns = [
      { field: 'title', headerName: 'Title', width: 400 },
      { field: 'section', headerName: 'Section', width: 125 },
      { field: 'times', headerName: 'Times', width: 200 },
      { field: 'building', headerName: 'Building', width: 150 },
      { field: 'room', headerName: 'Room',  width: 150 },
      { field: 'grade', headerName: 'Grade', width: 150 },
      {
        field: 'id',
        headerName: '  ',
        sortable: false,
        width: 200,
        renderCell: (params) => (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginLeft: 16 }} 
              onClick={()=>{this.onDelClick(params.value)}}
            >
              Drop
            </Button>
        )
      }
      ];
  
  return(
      <div>
          <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  { 'Schedule ' + this.props.location.year + ' ' +this.props.location.semester }
                </Typography>
            </Toolbar>
          </AppBar>
          <div className="App">
            <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
            </div>
            <Grid container>
              <Grid item>
			    <ButtonGroup>
                  <AddCourse addCourse={this.addCourse}  />
				</ButtonGroup>
              </Grid>
            </Grid>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={this.state.courses} columns={columns} />
            </div>
            <ToastContainer autoClose={1500} />   
          </div>
      </div>
      ); 
  }
}

export default SchedList;