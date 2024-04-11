"use client";
import { useGlobalState } from "@/app/context/globalProvider";
import axios from "axios";
import React, { useState, useEffect, ChangeEvent, useMemo } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import Button from "../Button/Button";
import { add, plus } from "@/app/utils/Icons";

interface Props {
  type: "Create" | "Update";
  id?: string;
}

const initialData = {
  title: "",
  description: "",
  date: "",
  completed: false,
  important: false,
};

function CreateContent({ type, id }: Props) {
  const [taskData, setTaskData] = useState(initialData);

  const { theme, allTasks, closeModal, getOneTask, task, updateOneTask } =
    useGlobalState();

  useMemo(() => {
    if (type === "Update") {
      getOneTask(id);
    }
    return;
  }, [type]);

  useEffect(() => {
    if (task) {
      const { title, description, date, isCompleted, isImportant } = task;

      setTaskData((val) => {
        return {
          title,
          description,
          date,
          completed: isCompleted,
          important: isImportant,
        };
      });
    }

    if (type === "Create") {
      setTaskData(initialData);
    }
  }, [task, type]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "title":
        setTaskData((val) => {
          return { ...val, title: e.target.value };
        });
        break;
      case "description":
        setTaskData((val) => {
          return { ...val, description: e.target.value };
        });
        break;
      case "date":
        setTaskData((val) => {
          return { ...val, date: e.target.value };
        });
        break;
      case "important":
        setTaskData((val) => {
          return { ...val, important: e.target.checked };
        });
        break;
      case "completed":
        setTaskData((val) => {
          return { ...val, completed: e.target.checked };
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    const task = {
      title: taskData.title,
      description: taskData.description,
      date: taskData.date,
      completed: taskData.completed,
      important: taskData.important,
    };

    if (type === "Create") {
      try {
        const res = await axios.post("/api/tasks", task);

        if (res.data.error) {
          toast.error(res.data.error);
        }

        if (!res.data.error) {
          toast.success("Task created successfully.");
          allTasks();
          closeModal();
        }
      } catch (error) {
        toast.error("Something went wrong.");
        console.log(error);
      }
    }

    if (type === "Update") {
      try {
        updateOneTask(id, task);
        toast.success("Task Updated successfully.");
      } catch (error) {
        toast.error("Something went wrong.");
        console.log(error);
      }
    }
  };

  return (
    <CreateContentStyled theme={theme}>
      <h1>{type} task</h1>
      <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="e.g, Run 10km in morning"
        />
      </div>
      <div className="input-control">
        <label htmlFor="description">Description</label>
        <input
          type="textarea"
          name="description"
          id="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
        />
      </div>

      <div className="input-control">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          name="date"
          id="date"
          value={taskData.date}
          onChange={handleChange}
        />
      </div>

      <div className="input-control toggler">
        <label htmlFor="important">Important</label>
        <input
          type="checkbox"
          name="important"
          id="important"
          onChange={handleChange}
        />
      </div>

      <div className="input-control toggler">
        <label htmlFor="completed">completed</label>
        <input
          type="checkbox"
          name="completed"
          id="completed"
          onChange={handleChange}
        />
      </div>

      <div className="submit-btn flex justify-between">
        <Button
          type="button"
          name="Reset"
          padding={"0.8rem 2rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          click={() => setTaskData(initialData)}
          background={"rgb(235, 104, 104)"}
        />

        <Button
          type="button"
          name={`${type} Task`}
          icon={add}
          padding={"0.8rem 2rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          click={handleSubmit}
          background={"rgb(0, 163, 255)"}
        />
      </div>
    </CreateContentStyled>
  );
}

const CreateContentStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1.6rem 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }

  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }

    i {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryGreen} !important;
      color: ${(props) => props.theme.colorWhite} !important;
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;

export default CreateContent;
