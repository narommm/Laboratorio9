import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Student {
    constructor(carnet, schedule, tarde) {
        this._carnet = carnet;
        this._schedule = schedule;
        this._tarde = tarde;
    }

    get carnet() { return this._carnet }
    get schedule() { return this._schedule }
    get tarde() { return this._tarde }

    // Hacen falta las validaciones antes de la asignación
    set carnet(carnet) { this._carnet = carnet }
    set schedule(schedule) { this._schedule = schedule }
    set tarde(tarde) { this._tarde = tarde}
}

class StudentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = { carnet: '', schedule: '', tarde: false };
        this.schedules=["Lunes de 9:00 a 11.00", "Martes de 13:30 a 15:30", "Miércoles de 9:00 a 11.00", "Jueves de 13:30 a 15:30", "Viernes de 9:00 a 11.00", "Viernes de 15:30 a 17:30"];
        //this.cambioDia = this.cambioDia.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSchedule = this.handleSchedule.bind(this);
       
    }
    handleSchedule(event){
        this.setState({schedule: event.target.value});
    }
    handleCheck(event){
        this.setState({
            tarde : !this.state.tarde
        });
    }
    handleSubmit(event) {
        event.preventDefault();

        // Se necesitan validaciones de entrada
        
        var carnet_regex = new RegExp('^[0-9]{8}$');
        const parseLateSwitch = (value)=>{
            if(value){
                return "Tardisimo"
            }
            return "A tiempo"
        }
        if(carnet_regex){
            let tarde = parseLateSwitch(this.state.tarde);
            let student = new Student(this.state.carnet, this.state.schedule, tarde);
            this.props.onSave(student);
        }

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const tarde = target.tarde;
        this.setState({
            [name]: value,
            [tarde]: false
        });
       
    }
    // select value={this.state.dia} onChange={this.cambioDia}
    // TODO: Necesita se modificado para funcionar con todos los tipos de entrada
  
    renderInput(name,tarde, type = "text") {
        return (
            <fieldset>
                <div class="form-group">
                <label htmlFor={name} >{name}</label>
                <input
                    type={type}
                    name={name} id={name}
                    value={this.state[name]}
                   // placeholder= {placeholder}
                    onChange={this.handleInputChange} />
                 <div class="form-group">
                 <label htmlfor="schedule">Seleccione el horario:</label>
                <select name="schedule" schedule={this.props.schedule} onChange={this.handleSchedule} className="form-control" id="schedule_field">
                    <option>Lunes de 9:00 a 11.00</option>
                    <option >Martes de 13:30 a 15:30</option>
                    <option>Miércoles de 9:00 a 11.00</option>
                    <option >Jueves de 13:30 a 15:30</option>
                    <option>Viernes de 9:00 a 11.00</option>
                    <option>Viernes de 15:30 a 17:30</option>
                </select>
                </div>
                 <div class="custom-control custom-switch">
                    <input
                    type="checkbox"
                    class="custom-control-input"
                    id="late_switch"
                    name = {tarde}
                    value={this.state.tarde}
                    onChange = {this.handleCheck}
                    id="late_switch"
                    />
                    <label class="custom-control-label" for="late_switch">Llegó tarde?</label>
                </div>
                </div>
            </fieldset>
        );
    }

    render() {
        return (
            <form id="contact" action="" onSubmit={this.handleSubmit}>
                 <h1> Registro de laboratorio.</h1>
                {this.renderInput("carnet")}
            
                <fieldset>
                    <button name="submit" type="submit" id="contact-submit" data-submit="...Sending">Submit</button>
                </fieldset>
            </form>
        );
    }
}

class StudentsList extends React.Component {

    renderHeader() {
        return Object.keys(new Student()).map((key, index) => {
            return (
                <th key={index}>
                    {key.substring(1)}
                </th>
            );
        });
    }

    renderBody(students) {
        return students.map(({ carnet, schedule, tarde }) => {
            return (
                <tr key={carnet} className="table-dark">
                    <td>{carnet}</td>
                    <td>{schedule}</td>
                    <td>{tarde}</td>
                    <td>
                        <button className="btn btn-danger" id="submit_btn" onClick={() => {this.props.onDelete(carnet)}}>Delete</button>
                    </td>
                </tr>
            );
        });
      
    }

    render() {
        return (
            <div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {this.renderHeader()}
                            <th> actions</th>
                        </tr>
                    </thead>
                    <tbody  id="table_body">
                         {this.renderBody(this.props.students)}
                    </tbody>
                </table>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            students: [],
            err: ''
        }
    }

    saveStudent(student) {
        const students = this.state.students.slice();
        if (!students.find((current) => {
            return current.carnet === student.carnet;
        })) {
            students.push(student);
            this.setState({ students, err: '' });
        } else {
            this.setState({ err: "El estudiante ya existe" })
        }

    }

    deleteStudent(carnet) {
        const students = this.state.students.filter(function (ele) {
            return ele.carnet !== carnet;
        });
        this.setState({ students });
    }

    render() {
        return (
            <div>
                <div className="container">
                    <div>{this.state.err}</div>
                    <StudentForm onSave={(student) => {
                        this.saveStudent(student)
                    }} />
                </div>
                <StudentsList students={this.state.students} onDelete={(carnet) => {
                    this.deleteStudent(carnet);
                }} />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
