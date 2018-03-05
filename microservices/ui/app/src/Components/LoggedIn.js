import React, { Component } from 'react';
import DropzoneComponent from 'react-dropzone-component';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import Media from 'react-media';

class Droppy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "block",
            uri: null,
            obj_disp: "none"
        }

        // For a full list of possible configurations,
        // please consult http://www.dropzonejs.com/#configuration
        this.djsConfig = {
            addRemoveLinks: true,
            acceptedFiles: "image/*,video/*,document/*",
            autoProcessQueue: false,
            dictDefaultMessage: "Upload your submission here."   
        };

        this.componentConfig = {
            dropzoneSelector: '#fin',
            showFiletypeIcon: false,
            postUrl: 'no-url'
        };
    }

    handleFileAdded(file) {
        let temp = URL.createObjectURL(file)
        this.setState({display:"none",uri:temp,obj_disp:"block"})
    }

    render() {
        const config = this.componentConfig;
        const djsConfig = this.djsConfig;

        // For a list of all possible events (there are many), see README.md!
        const eventHandlers = {
            addedfile: this.handleFileAdded.bind(this)
        }

        return (
            <div className="FinWrapper" style={{display:this.state.finDisp}}>
                <div 
                    id="fin" 
                    style={{
                        display:this.state.display,
                        width:this.props.droppy_width,
                        margin:"auto",
                        maxWidth:"100%"
                    }}
                >
                    <DropzoneComponent config={config} eventHandlers={eventHandlers} djsConfig={djsConfig}>
                        <div className="dz-message">Upload your submission here.</div>
                    </DropzoneComponent>
                </div>
                <object 
                    ref="object_placeholder" 
                    data={this.state.uri} 
                    style={{display:this.state.obj_disp,width:this.props.droppy_width,marginLeft:"20px",minHeight:this.props.droppy_height}} 
                    align="center" 
                    form="Formy"
                    aria-label="obj-placeholder"/>
            </div>
        )
    }
}

class DropDown extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
          open:false,
          eventList: [
            {
              "deadline": "",
              "phase": "open",
              "subtitle": "",
              "tags": "",
              "title": ""
            }
          ],
          choice: 1
        };
    }

    componentDidMount(){
        axios.get(`https://app.begun51.hasura-app.io/open`).then((result)=>{
          this.setState({eventList:result.data.data})
        })
      }

    handleChange = (event, index, value) => {
        this.setState({
            choice:value,
            open: true
        });
    }    

    handleRequestClose = () => {
        this.setState({
          open: false,
        });
    };

    render() {
      return (
        <div className="DDWrapper">  
            <DropDownMenu 
                value={this.state.choice} 
                onChange={this.handleChange} 
                style={{width:"50%",height:"100%"}} 
                autoWidth={false}
                anchorOrigin={{vertical: 'bottom', horizontal: 'middle'}}>
                {
                    this.state.eventList.map((item,index)=>
                        <MenuItem value={index+1} key={index} primaryText={item.title} />
                    )
                }
            </DropDownMenu>
            <Snackbar
                open={this.state.open}
                message={
                    this.state.eventList[this.state.choice-1].subtitle
                    +"        "+this.state.eventList[this.state.choice-1].tags
                    +"        "+this.state.eventList[this.state.choice-1].deadline
                }
                autoHideDuration={5000}
                onRequestClose={this.handleRequestClose}
            />    
        </div>
      );
    }
  }


class ResponsiveNominationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Event: '',
            Filename: '',
            Description: '',
            form_disp: "flex",
            finishedDisp: "none",
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

    handleChange(event) {
        let param = event.target.placeholder   
        this.setState({[param] : event.target.value});
        }

    handleSubmit(event) {
        event.preventDefault();
        let submission = this.refs.droppy.state.uri;
        let Event = this.refs.choicy.state.eventList[this.refs.choicy.state.choice-1].title;
        let Filename = this.state.Filename;
        let Description = this.state.Description;
        let body = {
            "event":Event,
            "filename":Filename,
            "description":Description,
            "submission":submission,
            "user_id":this.props.user_id
        }
        axios.post(`https://app.begun51.hasura-app.io/post`,body).then((result)=>{
            this.setState({form_disp:"none",finishedDisp:"block"});
        })
    }

    render() {
        return (
            <Paper zDepth={3} 
                className="FormWrapper" 
                style={{
                    width:this.props.container_width,
                    maxWidth: "100%",
                    height:this.props.container_height,
                    maxHeight: "100%",
                    marginTop: "25px"
                }}
            >    
            <form 
                className="Formy" 
                id="Formy" 
                onSubmit={this.handleSubmit} 
                style={{
                    display:this.state.form_disp,
                    flexDirection: "column",
                    }}>
                <h1>Post Status</h1>
                <DropDown ref="choicy" eventList={this.state.eventList} />
                <input 
                    placeholder="Filename" 
                    type="text" 
                    value={this.state.Filename} 
                    required 
                    onChange={this.handleChange} 
                    style={{width:this.props.fullWidth?"90%":"auto"}}
                />
                <input 
                    placeholder="Description" 
                    type="text" 
                    value={this.state.Description} 
                    required 
                    onChange={this.handleChange} 
                    style={{width:this.props.fullWidth?"90%":"auto"}}
                />
                <Droppy ref="droppy" droppy_width={this.props.droppy_width} droppy_height={this.props.droppy_height}/>
                <button>Send</button>
            </form>
            <Paper zDepth={1} className="DoneNominating" 
                style={{
                        display:this.state.finishedDisp,
                        marginTop:"25px",padding:"25px",
                        width:this.props.succes_width, marginLeft: "-75px"
                    }}>
                <span><b>Post</b></span>
                <img style={{width:this.props.succes_width,height:this.props.succes_height}} src="success.gif" alt="success"/>
            </Paper>     
            </Paper>
        );
    }
}

export default class NominationForm extends Component{
    render(){
        return(
            <Media query="(max-width: 1253px)">
                {matches =>
                matches ? (
                <ResponsiveNominationForm 
                    user_id={this.props.user_id}
                    container_width={(0.85*parseInt(window.innerWidth,10)).toString()+'px'}
                    container_height={(0.75*parseInt(window.innerHeight,10)).toString()+'px'}
                    succes_width={(0.75*parseInt(window.innerWidth,10)).toString()+'px'}
                    succes_height={(0.5*parseInt(window.innerHeight,10)).toString()+'px'}
                    droppy_width={(0.72*parseInt(window.innerWidth,10)).toString()+'px'}
                    droppy_height={(0.35*parseInt(window.innerHeight,10)).toString()+'px'}
                    fullWidth={true}
                    />
                    ) : (
                <ResponsiveNominationForm 
                    user_id={this.props.user_id}
                    container_width="max-content"
                    container_height="auto" 
                    succes_width="500px"
                    succes_height="500px"  
                    droppy_width="380px"
                    droppy_height="400px"  
                    />
                    )
                }
            </Media>
        )
    }
}