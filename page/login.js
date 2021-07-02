import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import {setData} from '../storage/AsyncStorage';
import {TOKEN_KEY} from '../constants/Constant';
import API from '../api/API';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';
import { BASIC_COLOR } from '../constants/Constant';
import { showMessage } from 'react-native-flash-message';

export default class Login extends React.Component {
  state = {
    name:"",
    password:"",
    disable:true,
    display: false
  }

  onSubmit = async () => {
    const input = {
      username: this.state.name,
      password: this.state.password
    }
    try {
      const token = await (await API.post('/authenticate', input)).data.token;
      setData(TOKEN_KEY, token);
      this.props.navigation.navigate('Main');

      showMessage({
        message: "Đăng nhập thành công !",
        type: "success",
        description: `Đăng nhập thành công với tài khoản: ${input.username}`,
        duration: 4000,
        floating: true,
        icon: {
          icon: "success", position: "right"
        },
      })
    } catch (err) {
        showMessage({
          message: "Đăng nhập không thành công !",
          type: "danger",
          description: "Tên đăng nhập hoặc mật khẩu không đúng",
          duration: 4000,
          floating: true,
          icon: {
            icon: "danger", position: "right"
          },
        })
    }
  }

  UNSAFE_componentWillReceiveProps = () => {
    if (this.props.route.params.name) {
      this.setState({ name: this.props.route.params.name })
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <View>
          <Text
            style={{color: 'white', fontSize: 40, fontWeight: 'bold', fontStyle: 'italic', paddingBottom: 70, padding: 30}}
          >
            Traceability
          </Text>
        </View>

        <View style={styles.grayView}>
        </View>

          <View style={styles.contentView}>
            <Text style={{fontSize: 30, fontWeight: 'bold', alignSelf: 'center', padding: 30}}>
              Login
            </Text>
            <Input
              placeholder='Name'
              leftIcon={
                <Icon
                  name='user'
                  size={24}
                  color={BASIC_COLOR}
                />
              }
              onChangeText={value => {
                this.setState({name: value})
              }}
              autoCapitalize="none"
              value={this.state.name}
            />  

            <Input
              placeholder='Password'
              leftIcon={
                <Icon
                  name='key'
                  size={24}
                  color={BASIC_COLOR}
                />
              }
              secureTextEntry={true}
              onChangeText={value => {
                this.setState({password: value})
              }}
              autoCapitalize="none"
              value={this.state.password}
            />
            <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("Reset Password")
              }}>
              <Text style={{alignSelf: 'flex-end', padding: 5}}>Forgot Password?</Text>
            </TouchableOpacity>
            <Button
              icon={
                <Icon
                  name="sign-in"
                  size={30}
                  color="white"
                />
              }
              title='Sign in'
              titleStyle={{color: 'white', fontSize: 20, padding: 10}}
              buttonStyle={{borderRadius: 50, backgroundColor: BASIC_COLOR}}
              onPress={this.onSubmit}
              containerStyle={{paddingLeft: 40, paddingRight: 40, paddingBottom: 30, paddingTop: 20}}
            />
        </View>
        <View style={{position: 'absolute', bottom: 0, padding: 20}}>
          <TouchableOpacity onPress={() => {
              this.props.navigation.navigate("Sign Up")
            }}>
            <Text>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
