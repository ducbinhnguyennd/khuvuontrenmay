import Hometele from "../page/tele/HomeTele/HomeTele";
import LoginTele from "../page/tele/LoginTele/Logintele";
import QuestionList from "../page/tele/Question/Question";
import RegisterTele from "../page/tele/RegisterTele/RegisterTele";

const publicRoutes = [
  { path: '/', component: Hometele },
  { path: '/login', component: LoginTele, layout: null },
  { path: '/register', component: RegisterTele, layout: null },
  { path: "/questions", component: QuestionList },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
