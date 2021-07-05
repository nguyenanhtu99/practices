import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import API from '../api/API';
import { ScrollView } from 'react-native-gesture-handler';
import { BASIC_COLOR } from '../constants/Constant';
import { showMessage } from 'react-native-flash-message';
import { USERNAME_LENGTH, PASSWORD_LENGTH } from '../constants/Constant';

export default class SignUp extends React.Component {
  state = {
    name:"",
    email:"",
    password:"",
    confirmPassword: "",
    nameError: '',
    emailError: '',
    passwordError: '',
    confirmPasswordError: ''
  }

  validate_password = (password) => {
    return password.length >= PASSWORD_LENGTH
  } 
  
  validate_confirm_password = (password, confirm_password) => {
    return password === confirm_password;
  } 

  check_duplicate_email = async (email) => {
    try {
      const response = await API.get(`account/users/email/${email}`);
      return response.data;
    } catch (err) {
      console.error(err.message);
    }
  }
  validate_email = async (email) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email)) {
      if (await this.check_duplicate_email(email)) {
        this.setState({
          email: email,
          emailError: ""
        })
      } else {
        this.setState({
          email: '',
          emailError: "Этот электронный адрес уже занят"
        })
      }
    } else {
      this.setState({
        email: '',
        emailError: "Неверный адрес электронной почты"
      })
    }
  }

  check_duplicate_username = async (name) => {
    try {
      const response = await API.get(`/account/users/name/${name}`);
      return response.data
    } catch (err) {
      showMessage({
        message: "Ошибка !",
        type: 'danger',
        description: err.message,
        duration: 5000,
        floating: true,
        icon: {
          icon: 'danger', position: "right"
        },
      })
    }
  }

  validate_username = async (username) => {
    if (username.length >= USERNAME_LENGTH) {
        if (await this.check_duplicate_username(username)) {
          this.setState({
            name: username,
            nameError: ""
          })
        } else {
          this.setState({
            name: '',
            nameError: "Имя пользователя доступно"
          })
        }
    } else {
      this.setState({
        name: '',
        nameError: `Имя пользователя должно состоять из ${USERNAME_LENGTH} или более символов`
      }) 
    }
  
  } 

  validate_before_submit = (input) => {
    return (input.name !== '' && input.password !== '' && input.email !== '' && this.state.confirmPassword !== '')
  }  

  onSubmit = async () => {
    let input = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    if (this.validate_before_submit(input)) {
      try {
        const response = await API.post('/account/users', input);
        console.log(response.data);
        this.props.navigation.navigate("Login", {message: "Sign up success !", name: input.name});

        showMessage({
          message: "Успешная регистрация !",
          type: "success",
          description: '',
          duration: 4000,
          floating: true,
          icon: {
            icon: "success", position: "right"
          },
        })

      } catch (err) {
        showMessage({
          message: "Регистрация не удалась !",
          type: 'danger',
          description: "Пожалуйста, проверьте сетевое соединение",
          duration: 5000,
          floating: true,
          icon: {
            icon: 'danger', position: "right"
          },
        })
      }
    } else {
      showMessage({
        message: "Регистрация не удалась !",
        type: 'danger',
        description: "Пожалуйста, проверьте информацию еще раз",
        duration: 5000,
        floating: true,
        icon: {
          icon: 'danger', position: "right"
        },
      })
    }

  }

  render(){
  return (
    // <View style={styles.container}>
    //   <View style = {styles.contentView}>
    //     <ScrollView>
    //       <Input
    //         placeholder='Tên đăng nhập'
    //         leftIcon={
    //           <Icon
    //             name='user'
    //             size={24}
    //             color={BASIC_COLOR}
    //           />
    //         }
    //         errorStyle={{ color: 'red' }}
    //         errorMessage={this.state.nameError}
    //         onChangeText={ value => this.validate_username(value) }
    //         autoCapitalize="none"
    //       />  
    //       <Input
    //         placeholder='Email'
    //         leftIcon={
    //           <Icon
    //             name='envelope'
    //             size={24}
    //             color={BASIC_COLOR}
    //           />
    //         }
    //         autoCapitalize="none"
    //         errorStyle={{ color: 'red' }}
    //         errorMessage={this.state.emailError}
    //         onChangeText={value => {
    //           this.validate_email(value) 
    //         }}
    //       />
    //       <Input
    //         placeholder='Mật khẩu'
    //         secureTextEntry={true}
    //         leftIcon={
    //           <Icon
    //             name='key'
    //             size={24}
    //             color={BASIC_COLOR}
    //           />
    //         }
    //         autoCapitalize="none"
    //         errorStyle={{ color: 'red' }}
    //         errorMessage={this.state.passwordError}
    //         onChangeText={value => {
    //           this.validate_password(value) 
    //             ? this.setState({ password: value, passwordError: ''}) 
    //             : this.setState({ password: '', passwordError: `Mật khẩu phải từ ${PASSWORD_LENGTH} ký tự trở lên`})
    //         }}
    //       />
    //       <Input
    //         placeholder='Nhập lại mật khẩu'
    //         secureTextEntry={true}
    //         leftIcon={
    //           <Icon
    //             name='key'
    //             size={24}
    //             color={BASIC_COLOR}
    //           />
    //         }
    //         autoCapitalize="none"
    //         errorStyle={{ color: 'red' }}
    //         errorMessage={this.state.confirmPasswordError}
    //         onChangeText={value => {
    //           this.validate_confirm_password(value, this.state.password) 
    //             ? this.setState({ confirmPassword: value, confirmPasswordError: ''}) 
    //             : this.setState({ confirmPassword: '', confirmPasswordError: "Mật khẩu không trùng khớp"})
    //         }}
    //       />
    //     </ScrollView>
    //     <View style={{margin: 20}}>
    //       <Button
    //         icon={
    //           <Icon
    //             name="user-plus"
    //             size={25}
    //             color={BASIC_COLOR}
    //           />
    //         }
    //         title='Đăng ký'
    //         type='outline'
    //         titleStyle={{color: BASIC_COLOR, fontSize: 20, padding: 30}}
    //         buttonStyle={{borderRadius: 30, borderColor: BASIC_COLOR}}
    //         onPress={this.onSubmit}
    //       />
    //     </View>
    //   </View>
    // </View>
    <View style={styles.container}>
        <View>
          <Text
            style={{color: 'white', fontSize: 40, fontWeight: 'bold', fontStyle: 'italic', paddingBottom: 70, padding: 30, fontFamily: 'serif'}}
          >
            Traceability
          </Text>
        </View>

        <View style={styles.grayView}>
        </View>

          <View style={styles.contentView}>
            <Text style={{fontSize: 30, fontWeight: 'bold', alignSelf: 'center', padding: 20}}>
              Новый аккаунт
            </Text>
            <Input
            placeholder='Имя пользователя'
            leftIcon={
              <Icon
                name='user'
                size={24}
                color={BASIC_COLOR}
              />
            }
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.nameError}
            onChangeText={ value => this.validate_username(value) }
            autoCapitalize="none"
          />  
          <Input
            placeholder='Почта'
            leftIcon={
              <Icon
                name='envelope'
                size={24}
                color={BASIC_COLOR}
              />
            }
            autoCapitalize="none"
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.emailError}
            onChangeText={value => {
              this.validate_email(value) 
            }}
          />
          <Input
            placeholder='Пароль'
            secureTextEntry={true}
            leftIcon={
              <Icon
                name='key'
                size={24}
                color={BASIC_COLOR}
              />
            }
            autoCapitalize="none"
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.passwordError}
            onChangeText={value => {
              this.validate_password(value) 
                ? this.setState({ password: value, passwordError: ''}) 
                : this.setState({ password: '', passwordError: `Пароль должен состоять из ${PASSWORD_LENGTH} или более символов.`})
            }}
          />
          <Input
            placeholder='Подтвердить пароль'
            secureTextEntry={true}
            leftIcon={
              <Icon
                name='key'
                size={24}
                color={BASIC_COLOR}
              />
            }
            autoCapitalize="none"
            errorStyle={{ color: 'red' }}
            errorMessage={this.state.confirmPasswordError}
            onChangeText={value => {
              this.validate_confirm_password(value, this.state.password) 
                ? this.setState({ confirmPassword: value, confirmPasswordError: ''}) 
                : this.setState({ confirmPassword: '', confirmPasswordError: "Пароль не подходит"})
            }}
          />
            <Button
              icon={
                <Icon
                  name="sign-in"
                  size={30}
                  color="white"
                />
              }
              title='Войти'
              titleStyle={{color: 'white', fontSize: 20, padding: 20}}
              buttonStyle={{borderRadius: 50, backgroundColor: BASIC_COLOR}}
              onPress={this.onSubmit}
              containerStyle={{paddingLeft: 40, paddingRight: 40, paddingBottom: 20, paddingTop: 20}}
            />
        </View>
        <View style={{position: 'absolute', bottom: 0, padding: 20}}>
          <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("Login")
            }}>
            <Text style={{textDecorationLine: 'underline'}}>Уже есть аккаунт? Авторизоваться</Text>
          </TouchableOpacity>
        </View>
      </View>
  )
}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: BASIC_COLOR
  },
  backgroundImage:{
    width: "100%",
    height: "100%",
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    position: 'absolute',
    top: 110,
    shadowColor: BASIC_COLOR,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.2,
    elevation: 20,
  },
  logo:{
    resizeMode: "contain",
    width: "45%",
    height: "30%",
    borderRadius: 100
  },
  grayView: {
    backgroundColor: '#f2f2f2',
    width: '160%',
    height: '150%',
    borderRadius: 250
  }
});