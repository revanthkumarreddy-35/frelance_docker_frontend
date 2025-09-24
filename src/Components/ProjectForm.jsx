import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert2';

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      successMessage: '',
      errorMessage: '',
      title: '',
      description: '',
      skill: '',
      budget: '',
      period: '',
    };
    this._handleChangeFile = this._handleChangeFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleSubmit(e) {
    e.preventDefault();
    let postProjectAPI = 'http://localhost:8080/postProject';
    let title = this.state.title.trim();
    let description = this.state.description;
    let skill = this.state.skill;
    let budget = this.state.budget;
    let period = this.state.period;
    let id = localStorage.getItem('id');

    if (!title || !description || !budget || !skill || !period) {
      swal({
        icon: 'error',
        title: 'Post Project',
        text: 'Please complete the form',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.state.file);
    formData.append('id', id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('skill', skill);
    formData.append('budget', budget);
    formData.append('period', period);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(postProjectAPI, formData, config).then((res) => {
      if (res.data.errorMsg !== '') {
        swal({
          icon: 'error',
          title: 'Post Project',
          text: 'Error Posting Project',
        });
      } else if (res.data.successMsg !== '') {
        swal({
          icon: 'success',
          title: 'Post Project',
          text: 'Project posted successfully',
        });
        // Optionally reset form state here
      }
    });
  }

  _handleChangeFile(e) {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      reader.onloadend = () => {
        this.setState({
          file: file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      swal({
        icon: 'error',
        title: 'File Upload',
        text: 'Only PDF attachments allowed',
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9 personal-info">
            <h3>Project Info</h3>
            <hr />

            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-lg-3 control-label"><strong>Title</strong></label>
                <div className="col-lg-8">
                  <input className="form-control" type="text" name="title"
                    placeholder="Title" required value={this.state.title} onChange={this.handleUserInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label"><strong>Description</strong></label>
                <div className="col-md-8">
                  <textarea className="form-control" rows="5" name="description"
                    placeholder="Description" required value={this.state.description} onChange={this.handleUserInput}></textarea>
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label"><strong>Main Skill</strong></label>
                <div className="col-lg-8">
                  <input className="form-control" type="text" name="skill"
                    placeholder="Skill" required value={this.state.skill} onChange={this.handleUserInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label"><strong>Budget Range</strong></label>
                <div className="col-lg-8">
                  <input className="form-control" type="text" name="budget"
                    placeholder="Like 100-200" required value={this.state.budget} onChange={this.handleUserInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label"><strong>Budget Period</strong></label>
                <div className="col-lg-8">
                  <input className="form-control" type="number" name="period"
                    placeholder="Period in Days" required value={this.state.period} onChange={this.handleUserInput} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-lg-3 control-label"><strong>Attachment</strong></label>
                <div className="col-lg-8">
                  <input type="file" className="form-control" onChange={this._handleChangeFile} />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-3 control-label"></label>
                <div className="col-md-8">
                  <input type="submit" className="btn btn-primary"
                    value="Post Project" required onClick={this.handleSubmit} />
                  <span></span>
                  <Link to='/home'>
                    <input type="reset" className="btn btn-default" value="Cancel" />
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default withRouter(ProjectForm);