import { CometChat } from "@cometchat/chat-sdk-react-native";
import React, { useContext, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { AppStyle } from "../../AppStyle";
import { CardView } from "../../components/common/CardView";
import { Logout } from "../../resources";
import { UserContext } from "../../../UserContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome"; // Import the icons you want to use
import {
  CometChatConversationsWithMessages,
  CometChatConversations,
  CometChatUsersWithMessages,
  CometChatUsers,
} from "@cometchat/chat-uikit-react-native";
import { CometChatGroupsWithMessages } from "@cometchat/chat-uikit-react-native";

const UiKitModules = [
  {
    name: "Conversations",
    info: "Conversations module helps you to list the recent conversations between your users and groups. To learn more about components click here.",
  },
  {
    name: "Messages",
    info: "Messages module helps you to send and receive in a conversation between a user or group. To learn more about its components click here.",
  },
  {
    name: "Users",
    info: "Users module helps you list all the users available in you app. To learn more about its components click here.",
  },
  {
    name: "Groups",
    info: "Groups module helps you list all the groups you are apart in your app. To learn more about its components click here.",
  },
  {
    name: "Calls",
    info: "Calls module helps you to list the recent call history between your users and groups. To learn more about this component click here.",
  },
  {
    name: "Shared",
    info: "Share module contains several resuable components that are devided into Primary, Secondary and SDKderived components. To learn more about these components click here.",
  },
];

export const Home = ({ navigation }) => {
  const Tab = createBottomTabNavigator();

  const { setGroup, setUser, setCall } = useContext(UserContext);

  const Navigate = (to) => {
    navigation.navigate(`${to}Module`);
  };

  useEffect(() => {
    let userRequest = new CometChat.UsersRequestBuilder().setLimit(1).build();
    let groupRequest = new CometChat.GroupsRequestBuilder().setLimit(1).build();
    let callRequest = new CometChat.MessagesRequestBuilder()
      .setCategories([CometChat.CATEGORY_CALL, CometChat.CATEGORY_CUSTOM])
      .setTypes([
        CometChat.MESSAGE_TYPE.AUDIO,
        CometChat.MESSAGE_TYPE.VIDEO,
        "meeting",
      ])
      .setLimit(1)
      .build();

    callRequest.fetchPrevious().then((calls) => {
      if (calls.length > 0) {
        setCall?.(calls[0]);
      }
    });

    userRequest
      .fetchNext()
      .then((res) => {
        console.log("setting user", res[0]["uid"]);
        if (res.length > 0) setUser?.(res[0]);
      })
      .catch((rej) => {
        console.log("no user found");
      });
    groupRequest
      .fetchNext()
      .then((res) => {
        console.log("setting group", res[0]["guid"]);
        if (res.length > 0) setGroup?.(res[0]);
      })
      .catch((rej) => {
        console.log("no group found");
      });
  }, []);

  return (
    <View style={AppStyle.container}>
      {/* <View
        style={[
          AppStyle.row,
          AppStyle.center,
          { justifyContent: "space-between", margin: 8 },
        ]}
      >
        <Text style={AppStyle.heading}>UI Components</Text>
        <TouchableOpacity
          onPress={() => {
            CometChat.logout().then(() => {
              navigation.navigate("Login");
            });
          }}
        >
          <Image source={Logout} style={{ height: 24, width: 24 }} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {UiKitModules.map((module) => (
          <CardView
            key={module.name}
            name={module.name}
            info={module.info}
            onPress={() => Navigate(module.name)}
          />
        ))}
      </ScrollView> */}
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
      >
        {/* <Tab.Screen
        name="Messages"
        component={CometChatMessages}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="envelope" color={color} size={size} />
          ),
        }}
      /> */}
        <Tab.Screen
          name="Chats"
          component={CometChatConversationsWithMessages}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="comments" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Users"
          component={CometChatUsersWithMessages}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="user" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Groups"
          component={CometChatGroupsWithMessages}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="group" color={color} size={size} />
            ),
          }}
        />
        {/* <Tab.Screen
        name="GroupList"
        component={CometChatGroup}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="group" color={color} size={size} />
          ),
        }}
      /> */}
      </Tab.Navigator>
    </View>
  );
};
