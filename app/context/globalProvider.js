"use client";
import React, { createContext, useState, useContext } from "react";
import themes from "./themes";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { ITask } from "@/app/Components/Modals/ViewTask";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { user } = useUser();

  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [viewModal, setViewModel] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [type, setType] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [id, setId] = useState(null);

  const theme = themes[selectedTheme];

  const openModal = (type) => {
    type === "Update" ? setType("Update") : setType("Create");
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setViewModel(false);
  };

  const collapseMenu = () => {
    setCollapsed(!collapsed);
  };

  const showTask = () => {
    setViewModel(true);
  };

  const allTasks = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("/api/tasks");

      const sorted = res.data.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      setTasks(sorted);

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`/api/tasks/${id}`);
      toast.success("Task deleted");

      allTasks();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getOneTask = async (id) => {
    try {
      const res = await axios.get(`/api/tasks/${id}`);

      setTask(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const updateOneTask = async (id, data) => {
    try {
      await axios.patch(`/api/tasks/${id}`, data);

      toast.success("Task updated");
      allTasks();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const updateTask = async (task) => {
    try {
      const res = await axios.put(`/api/tasks`, task);

      toast.success("Task updated");

      allTasks();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const completedTasks = tasks.filter((task) => task.isCompleted === true);
  const importantTasks = tasks.filter((task) => task.isImportant === true);
  const incompleteTasks = tasks.filter((task) => task.isCompleted === false);

  React.useEffect(() => {
    if (user) allTasks();
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        theme,
        tasks,
        deleteTask,
        isLoading,
        completedTasks,
        importantTasks,
        incompleteTasks,
        updateTask,
        modal,
        openModal,
        closeModal,
        allTasks,
        collapsed,
        collapseMenu,
        type,
        getOneTask,
        task,
        id,
        setId,
        updateOneTask,
        viewModal,
        showTask,
      }}
    >
      <GlobalUpdateContext.Provider value={{}}>
        {children}
      </GlobalUpdateContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);
