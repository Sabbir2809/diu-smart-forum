import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignUpUserMutation } from '../services/appApi';
import '../style/Signup.css';
import { Button, Checkbox, TextField, Backdrop, CircularProgress } from '@mui/material';
import { Alert } from '@mui/material';

const Signup = () => {
  const [inputName, setInputName] = useState('');
  const [inputDepartment, setInputDepartment] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [response, setResponse] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  const [signUpFunction] = useSignUpUserMutation();

  const handleSignup = (e) => {
    e.preventDefault();

    if (inputName.length === 0 || inputEmail.length === 0) {
      setResponse(true);
      setIsError(true);
      setAlertMessage('Field can not be empty!');
      return;
    } else if (inputPassword.length < 8) {
      setResponse(true);
      setIsError(true);
      setAlertMessage('Password must be length 8');
      return;
    }
    setDisableSubmit(true);

    signUpFunction({
      name: inputName,
      department: inputDepartment,
      email: inputEmail,
      password: inputPassword,
    }).then(({ data, error }) => {
      console.log(error);
      setResponse(true);
      if (data) {
        setIsError(false);
        setAlertMessage(data);
      } else {
        setIsError(true);
        setAlertMessage(error.data);
      }
      setDisableSubmit(false);
    });

    setInputEmail('');
    setInputPassword('');
  };

  return (
    <div className='signup-outer'>
      <Backdrop
        className='backdrop-dialog'
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={response}
        onClick={() => {
          setDisableSubmit(false);
          setResponse(false);
          setAlertMessage('');
        }}>
        <Alert
          className='response-dialog'
          style={{
            display: response ? 'flex' : 'none',
            color: isError ? 'red' : 'green',
          }}
          severity={isError ? 'error' : 'success'}>
          {alertMessage}
        </Alert>
      </Backdrop>
      <div className='signup-wrapper'>
        <div className='flex-center-wrapper row-gap-2'>
          <div className='company-title'>DIU SMART FORUM</div>
          <div className='page-title'>Sign up</div>
          <div className='signup-form'>
            <div className='input-item'>
              <TextField
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className='custom-input-field'
                type='text'
                variant='outlined'
                label='Username'
                margin='dense'
                id='input-name'
                required
                autoFocus={true}
              />
            </div>
            <div className='input-item'>
              <TextField
                value={inputDepartment}
                onChange={(e) => setInputDepartment(e.target.value)}
                className='custom-input-field'
                type='text'
                variant='outlined'
                label='Which Department'
                margin='dense'
                id='input-department'
                autoFocus={true}
              />
            </div>
            <div className='input-item'>
              <TextField
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className='custom-input-field'
                type='email'
                variant='outlined'
                label='Enter your Email Address'
                margin='dense'
                id='input-email'
                autoComplete='off'
                required
              />
            </div>
            <div className='input-item'>
              <TextField
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className='custom-input-field'
                type='password'
                variant='outlined'
                label='Password'
                margin='dense'
                id='input-password'
                required
              />
            </div>

            <div className='terms-and-policy'>
              <Checkbox defaultChecked required size='small' />
              <a href='/terms_of_service'>Term's of service</a> & <a href='/policy'>Policy</a>
            </div>

            <div className='button-group'>
              <Button onClick={() => navigate('/login')} variant='text'>
                Login
              </Button>
              <Button onClick={handleSignup} variant='contained' disableElevation disabled={disableSubmit}>
                {disableSubmit ? (
                  <CircularProgress style={{ width: '20px', height: '20px' }} />
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
