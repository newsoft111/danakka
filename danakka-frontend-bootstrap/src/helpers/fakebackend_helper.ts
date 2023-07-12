import axios from "axios";
import * as url from "./url_helper";
import { ApiCore } from "./api_helper";
import { create } from "lodash";

const api = new ApiCore();
// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Register Method
const postFakeRegister = (data: any) => {
  return api
    .create(url.POST_FAKE_REGISTER, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postFakeLogin = (data: any) => {
  return api.create(url.POST_FAKE_LOGIN, data);
};
// postForgetPwd
const postFakeForgetPwd = (data: any) => {
  return api.create(url.POST_FAKE_PASSWORD_FORGET, data);
};
// Edit profile
const postJwtProfile = (data: any) => {
  return api.create(url.POST_EDIT_JWT_PROFILE, data);
};
const postFakeProfile = (data: any) => {
  return api.create(url.POST_EDIT_PROFILE, data);
};
// Register Method
const postJwtRegister = (url: string, data: any) => {
  return api
    .create(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
const postJwtLogin = (data: any) => {
  return api.create(url.POST_FAKE_JWT_LOGIN, data);
};

// postForgetPwd
const postJwtForgetPwd = (data: any) => {
  return api.create(url.POST_FAKE_JWT_PASSWORD_FORGET, data);
};

// postSocialLogin
const postSocialLogin = (data: any) => {
  return api.create(url.SOCIAL_LOGIN, data);
};

// get Events
const getEvents = () => {
  return api.get(url.GET_EVENTS);
};

// add Events
const addNewEvent = (event: any) => {
  return api.create(url.ADD_NEW_EVENT, event);
};

// update Event
const updateEvent = (event: any) => {
  return api.update(url.UPDATE_EVENT, event);
};

// delete Event
const deleteEvent = (event: any) => {
  return api.delete(url.DELETE_EVENT, { headers: { event } });
};

// get Categories
const getCategories = () => {
  return api.get(url.GET_CATEGORIES);
};
// get chats
const getChats = () => {
  return api.get(url.GET_CHATS);
};

// get groups
const getGroups = () => {
  return api.get(url.GET_GROUPS);
};

// get Contacts
const getContacts = () => {
  return api.get(url.GET_CONTACTS);
};

// get messages
const getMessages = (roomId = "") =>{
  return api.get(`${url.GET_MESSAGES}/${roomId}`, { params: { roomId } });
};

// post messages
const addMessage = (message: any) =>{
return api.create(url.ADD_MESSAGE, message);
};

// get invoices
const getInvoices = () =>  {
  return api.get(url.GET_INVOICES);
};

// get Kanbanboards
const getKanbanboards = () =>  {
  return api.get(url.GET_KANBANBOARDS);
};

// get Contacts
const getUsers = () => {
  return api.get(url.GET_USERS);
};

// add user
const addNewUser = (user: any) => {
  return api.create(url.ADD_NEW_USER, user);
};

//delete user
const deleteUser = (user: any) => {
  return api.delete(url.DELETE_USER, { headers: { user } });
}

//update user
const updateUser = (user: any) => {
  return api.update(url.UPDATE_USER, user);
};

// add invoice
const addNewInvoice = (invoice: any) => {
  return api.create(url.ADD_INVOICE, invoice)
}

//delete invoice
const deleteInvoice = (invoice : any) => {
  return api.delete(url.DELETE_INVOICE, { headers: { invoice } });
}

//update invoice
const updateInvoice = (invoice: any) => {
  return api.update(url.UPDATE_INVOICE, invoice);
};

/** PROJECT */
// get project
const getProjects = () => {
  return api.get(url.GET_PROJECTS);
};

const getUserProfile = () => {
  return api.get(url.GET_USER_PROFILE);
};

export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
  getUsers,
  addNewUser,
  getEvents,
  addNewEvent,
  updateEvent,
  deleteEvent,
  getCategories,
  getChats,
  getGroups,
  getContacts,
  getMessages,
  addMessage,
  getInvoices,
  getKanbanboards,
  getProjects,
  getUserProfile,
  postSocialLogin,
  addNewInvoice,
  deleteInvoice,
  updateInvoice,
  updateUser,
  deleteUser
};
