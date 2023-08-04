interface User {
	user_id: string;
	email: string;
	nickname: string;
	phone_number: string;
}
  
interface UserData {
	user: User;
}
  
  // Function to update the user information in local storage
export const updateUserInformation = (fieldName: keyof User, value: string): void => {
	const savedUser = localStorage.getItem('user');
	if (savedUser) {
	  const userData: UserData = JSON.parse(savedUser);
	  userData.user[fieldName] = value;
	  localStorage.setItem('user', JSON.stringify(userData));
	}
};
  