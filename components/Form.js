const {
    TextField,
    Grid,
    FormControl,
    useFormControl,
    OutlinedInput,
    FormHelperText,
    Typography,
    Button,
    Container,
    Box,
    Modal,
    Avatar
  } = MaterialUI;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const messagesWhenValid = ["🎉🎉🎉 Sukces 🎉🎉🎉", "Podane dane są prawidłowe!"]
const messagesWhenNotValid = ["🚫 Błąd 🚫", "Podane dane są nieprawidłowe!"]
  
class Form extends React.Component {
    constructor() {
        super();
        this.state = {
            isCorrectName: false,
            isCorrectPesel: false,
            isEverythingValid: false,
            firstname: '',
            lastname: '',
            pesel: '',
            birthdate: '',
            checkDate: "",
            isOpened: false,
            peselError: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
    }

    isValidName(event) {
        const value = event.target.value;
        if (typeof value == "string") {
            this.setState({isCorrectName: true})
        }
    }

    isValidPesel() {
        const pesel = this.state.pesel
        let year = pesel.substring(0, 2)
        let tests = 0;
        if (pesel.length == 11) tests ++;
        if (year <= 22 || year >= 22) tests++
        let month = pesel.substring(2, 4)
        if ((month >= 21 && month <= 32 && year <= 22) || (month >= 1 && month <= 12 && year >= 23)) tests++
        let day = pesel.substring(4, 6)
        if (day <= 31) tests++
        if (tests != 4) return false
        this.setState({checkDate: pesel})
        return true
    }

    convertPeselToDate(value) {
        let pesel = this.state.pesel == "" ? value : this.state.pesel
        let year = pesel.substring(0, 2)
        if (year <= 22) {
            year = '20' + year
        } else {
            year = '19' + year
        }
        let month = pesel.substring(2, 4)
        if (month >= 21 && month <= 32) {
            month = '0' + month[1]
        }
        else if (month >= 1 && month <= 12) month = month
        else return false;
        let day = pesel.substring(4, 6)
        if (day > 31) return false
        let date =  year + "-" + month + "-" + day
        this.setState({birthdate: date, isCorrectPesel: this.isValidPesel() ? true : false}, () => {
            this.setState({checkDate: date})
        })
    }

    handleNameChange(event) {
        let name = event.target.name
        let value = event.target.value
        if (value[value.length - 1] == 0) return false //parseInt ignores zero
        if (!parseInt(value)) this.setState({[name]: value})
        else return false
    }

    handleChange(event) {
        let value = event.target.value
        if (value[value.length - 1] == " ") return this.setState({isCorrectPesel: false})
        else if (isNaN(value)) return this.setState({isCorrectPesel: false})
        else if (new Date(value[0] + value[1])) this.setState({isCorrectPesel: false})
        this.setState({ pesel: value, birthdate: value, peselError: false }, () => {
            this.convertPeselToDate(value)
        })
    }

    handleSubmit() {
        this.setState({isOpened: true}, () => {
            if (!this.state.isCorrectPesel) this.setState({peselError: true})
            if (this.state.birthdate != this.state.checkDate) this.setState({peselError: true, isCorrectPesel: false})
            else if (this.state.birthdate == this.state.checkDate && this.state.isCorrectPesel) this.setState({peselError: false, isCorrectPesel: true})
            console.log(this.state.birthdate)
            console.log("sprawdz date " + this.state.checkDate)
        })
    }
    render() {
        return (
            <div>
                <Container component="main">
                    <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Avatar src="../lock.png" sx={{width: 56, height: 56, marginBottom: "1.5vh"}} title="Icon created by Ilham Fitrotul Hayat (https://www.flaticon.com/premium-icon/lock_2763100)"></Avatar>
                        <FormControl sx={{ width: '40ch' }}>
                            <Typography align="center" component="h1" variant="h5">
                                Formularz
                            </Typography>
                            <TextField inputProps={{ maxLength: 20}} value={this.state.firstname} margin="normal" label={"Imię"} name="firstname" onChange={this.handleNameChange}></TextField>
                            <TextField inputProps={{ maxLength: 30}} value={this.state.lastname} margin="normal" label={"Nazwisko"} name="lastname" onChange={this.handleNameChange} ></TextField>
                            <TextField error={this.state.peselError} inputProps={{ maxLength: 11 }} type="text" value={this.state.pesel} onChange={this.handleChange} margin="normal" label={"PESEL"} id="pasel"></TextField>
                            <TextField inputProps={{ min: "1900,04,09", max: "2050-04-09"}} margin="normal" type="date" onChange={(event) => {this.setState({birthdate: event.target.value})}} value={this.state.birthdate} id="data"></TextField>
                            <Button onClick={this.handleSubmit} style={{marginTop: "1.5vh"}} variant="contained">Wyślij</Button>
                        </FormControl>
                    </Box>
                </Container>
                <Modal open={this.state.isOpened} onClose={() => this.setState({isOpened: false})} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography align="center" id="modal-modal-title" variant="h6" component="h2">
                    {this.state.isCorrectPesel ? messagesWhenValid[0] : messagesWhenNotValid[0]}
                    </Typography>
                    <Typography align="center" id="modal-modal-description" sx={{ mt: 2 }}>
                    {this.state.isCorrectPesel ? messagesWhenValid[1] : messagesWhenNotValid[1]}
                    </Typography>
                </Box>
                </Modal>
            </div>  
        )
    }
}

ReactDOM.render(<Form />, document.getElementById('root'))