import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import {
   VALIDATOR_EMAIL,
   VALIDATOR_MINLENGTH,
   VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
   const auth = useContext(AuthContext);
   const [isLogin, setIsLogin] = useState(true);

   const { isLoading, error, sendRequest, clearError } = useHttpClient();

   const [formState, inputHandler, setFormData] = useForm(
      {
         email: {
            value: '',
            isValid: false,
         },
         password: {
            value: '',
            isValid: false,
         },
      },
      false
   );
   const authSubmitHandler = async (e) => {
      e.preventDefault();
      if (isLogin) {
         try {
            const responseData = await sendRequest(
               'http://localhost:5000/api/users/login',
               'POST',
               JSON.stringify({
                  email: formState.inputs.email.value,
                  password: formState.inputs.password.value,
               }),
               { 'Content-Type': 'application/json' }
            );
            auth.login(responseData.user.id);
         } catch (err) {}
      } else {
         try {
            const responseData = await sendRequest(
               'http://localhost:5000/api/users/signup',
               'POST',
               JSON.stringify({
                  name: formState.inputs.name.value,
                  email: formState.inputs.email.value,
                  password: formState.inputs.password.value,
               }),
               {
                  'Content-Type': 'application/json',
               }
            );
            auth.login(responseData.user.id);
         } catch (err) {}
      }
   };

   const switchModeHandler = () => {
      if (!isLogin) {
         setFormData(
            { ...formState.inputs, name: undefined },
            formState.inputs.email.isValid &&
               formState.inputs.password.isValid
         );
      } else {
         setFormData(
            {
               ...formState.inputs,
               name: { value: '', isValid: false },
            },
            false
         );
      }
      setIsLogin(!isLogin);
   };

   return (
      <React.Fragment>
         <ErrorModal error={error} onClear={clearError} />
         <Card className="authentication">
            {isLoading && <LoadingSpinner asOverlay />}
            <h2>Login Required</h2>
            <hr />
            <form onSubmit={authSubmitHandler}>
               {!isLogin && (
                  <Input
                     element="input"
                     id="name"
                     type="text"
                     label="Your Name"
                     validators={[VALIDATOR_REQUIRE]}
                     errorText="please enter your Name"
                     onInput={inputHandler}
                  />
               )}
               <Input
                  element="input"
                  id="email"
                  type="email"
                  label="E-Mail"
                  validators={[VALIDATOR_EMAIL()]}
                  errorText="please enter a valid email"
                  onInput={inputHandler}
               />
               <Input
                  element="input"
                  id="password"
                  type="password"
                  label="Password"
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  errorText="please enter a valid password"
                  onInput={inputHandler}
               />
               <Button type="Submit" disabled={!formState.isValid}>
                  {isLogin ? 'Login' : 'Sign Up'}
               </Button>
            </form>
            <Button inverse onClick={switchModeHandler}>
               Switch to {isLogin ? 'Sign Up' : 'Login'}
            </Button>
         </Card>
      </React.Fragment>
   );
};

export default Auth;
