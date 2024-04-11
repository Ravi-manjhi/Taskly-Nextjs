import { useGlobalState } from "@/app/context/globalProvider";
import React from "react";
import styled from "styled-components";

interface Props {
  id: string;
}

function ViewContent({ id }: Props) {
  const { task, getOneTask } = useGlobalState();

  React.useEffect(() => {
    getOneTask(id);
  }, [id]);

  if (!task) {
    return <LoadingSpinner />;
  }
  return (
    <ViewContentStyled>
      <h1>View Task</h1>
      <div className="task-detail">
        <label>Title:</label>
        <div>{task.title}</div>
      </div>
      <div className="task-detail">
        <label>Description:</label>
        <div>{task.description}</div>
      </div>
      <div className="task-detail">
        <label>Date:</label>
        <div>{task.date}</div>
      </div>
      <div className="task-detail">
        <label>Important:</label>
        <div>{task.isImportant ? "Yes" : "No"}</div>
      </div>
      <div className="task-detail">
        <label>Completed:</label>
        <div>{task.isCompleted ? "Yes" : "No"}</div>
      </div>
    </ViewContentStyled>
  );
}

const ViewContentStyled = styled.div`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .task-detail {
    margin-bottom: 1.5rem;

    label {
      font-weight: 500;
      display: block;
      margin-bottom: 0.5rem;
    }

    div {
      font-size: 1rem;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  border: 6px solid rgba(0, 0, 0, 0.1);
  border-top: 6px solid #333;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
`;
export default ViewContent;
