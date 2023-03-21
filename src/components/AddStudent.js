import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import {SERVER_URL} from '../constants.js'



// properties addCoure is required, function called when Add clicked.
class AddStudent extends Component {
      constructor(props) {
      super(props);
      this.state = {open: false, student:{} };
    };
    
    handleClickOpen = () => {
      this.setState( {open:true} );
    };

    handleClose = () => {
      this.setState( {open:false} );
    };

    handleChange = (event) => {
      this.setState({student:{name: event.target.value}});
    }

  // Save new student and close modal form
    handleAdd = () => {
       this.props.addStudent(this.state.student);
       this.handleClose();
    }

// Add new student fetch method
    // fetchstudent = () => {
    //     console.log("AddStudent.fetchstudent");
    //     const token = Cookies.get('XSRF-TOKEN');
        
    //     fetch(`${SERVER_URL}/name=${this.props.location.year}&email=${this.props.location.semester}`, 
    //       {  
    //         method: 'POST', 
    //         headers: { 'X-XSRF-TOKEN': token }
    //       } )
    //     .then((response) => {
    //       console.log("FETCH RESP:"+response);
    //       return response.json();}) 
    //     .then((responseData) => { 

    //       // do a sanity check on response
    //       if (Array.isArray(responseData.student)) {
    //         this.setState({ 
    //           student: responseData.student,
    //         });
    //       } else {
    //         toast.error("Fetch failed.", {
    //           position: toast.POSITION.BOTTOM_LEFT
    //         });
    //       }        
    //     })
    //     .catch(err => {
    //       toast.error("Fetch failed.", {
    //           position: toast.POSITION.BOTTOM_LEFT
    //         });
    //         console.error(err); 
    //     })
    //   }


  // Add new student (this is the created method)
  addNewStudent = (student) => {
    const token = Cookies.get('XSRF-TOKEN');
 
    fetch(`${SERVER_URL}/studentRoute`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json',
                   'X-XSRF-TOKEN': token  }, 
        body: JSON.stringify(student)
      })
    .then(res => {
        if (res.ok) {
          toast.success("New student successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchstudent();
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

    render()  { 
      return (
          <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
              Add New Student
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                  <TextField autoFocus fullWidth label="Name" Name="name" onChange={this.handleChange}  /> 
                </DialogContent>
                <DialogContent  style={{paddingTop: 20}} >
                  <TextField autoFocus fullWidth label="Email" Email="email" onChange={this.handleChange}  /> 
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                  <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button> 

                </DialogActions>
              </Dialog>      
          </div>
      ); 
    }
}

// required property:  addCourse is a function to call to perform the Add action
AddStudent.propTypes = {
  addCourse : PropTypes.func.isRequired
}

export default AddStudent;