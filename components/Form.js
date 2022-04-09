// todo:
// poukladac componenty
// dac textfield error
// naprawic bugi

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
            pesel: '',
            birthdate: '',
            isOpened: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    validateName(event) {
        const name = event.target.name;

        if (name.contains("name")) {
            if (typeof name == "string") {
                this.setState({isCorrectName: true})
            }
        }
    }

    isValidPesel() {
        const pesel = this.state.pesel
        let year = pesel.substring(0, 2)
        if (!year <= 22 || !year >= 22) return false
        let month = pesel.substring(2, 4)
        if (!(month >= 21 && month <= 32 && year <= 22) || !(month >= 1 && month <= 12 && year >= 23)) return false
        let day = pesel.substring(4, 6)
        if (!day <= 31) return false
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
        console.log(this.state)
        this.setState({birthdate: date, isCorrectPesel: pesel.length == 11 ? true : false})
        console.log(pesel.split(''))
        console.log(this.state.birthdate.split(""))
    }

    handleChange(event) {
        let value = event.target.value
        console.log(value)
        if (value[value.length - 1] == " ") return this.setState({isCorrectPesel: false})
        else if (isNaN(value)) return this.setState({isCorrectPesel: false})
        this.setState({ pesel: value, birthdate: value }, () => {
            this.convertPeselToDate(value)
        })
    }

    handleSubmit() {
        console.log(this.isValidPesel)
        this.setState({isOpened: true}, () => {
            if (this.state.isValidPesel) this.setState({isEverythingValid: true})
        })
    }
    render() {
        return (
            <div>
                <Container component="main">
                    <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <FormControl sx={{ width: '40ch' }}>
                            <Typography align="center" component="h1" variant="h5">
                                Formularz
                            </Typography>
                            <TextField inputProps={{ maxLength: 20}} fullWidth margin="normal" label={"Imię"} id="imie"></TextField>
                            <TextField inputProps={{ maxLength: 30}} margin="normal" label={"Nazwisko"} id="nazwisko"></TextField>
                            <TextField inputProps={{ maxLength: 11 }} type="text" value={this.state.pesel} onChange={this.handleChange} margin="normal" label={"PESEL"} id="pasel"></TextField>
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