import { RouteObject } from "react-router-dom";
import { Layout } from "./layout";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import InterviewQuestions from "./pages/InterviewQuestions";
import QuestionDetail from "./pages/QuestionDetail";
import SearchResults from "./pages/SearchResults";
import KnowledgeDetail from "./pages/KnowledgeDetail";
import SubTopicDetail from "./pages/SubTopicDetail";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/articles",
        element: <Articles />,
      },
      {
        path: "/articles/:id",
        element: <ArticleDetail />,
      },
      {
        path: "/interview",
        element: <InterviewQuestions />,
      },
      {
        path: "/interview/:id",
        element: <QuestionDetail />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/knowledge/:category",
        element: <KnowledgeDetail />,
      },
      {
        path: "/knowledge/:category/:articleId/:subTopicId",
        element: <SubTopicDetail />,
      },
    ],
  },
];
