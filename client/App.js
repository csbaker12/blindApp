import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

const switchNavigator = createSwitchNavigator({
  // ResolveAuth: ResolveAuthScreen,
  // loginFlow: createStackNavigator({
  //   Signup: SignupScreen,
  //   Signin: SigninScreen,
  // }),
  // mainFlow: createBottomTabNavigator({
  //   trackListFlow: createStackNavigator({
  //     trackList: TrackListScreen,
  //     trackDetail: TrackDetailScreen,
  //   }),
  //   TrackCreate: TrackCreateScreen,
  //   Account: AccountScreen,
  // }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    // <LocationProvider>
    //   <AuthProvider>
    <App
    // ref={(navigator) => {
    //   setNavigator(navigator);
    // }}
    />
    //   </AuthProvider>
    // </LocationProvider>
  );
};
