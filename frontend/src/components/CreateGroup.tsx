import { useState } from "react";
import { useAppSelector } from "../toolkit/hooks";

function CreateGroup() {
  const [name, setName] = useState<string>("");
  const { user } = useAppSelector((state) => state.user);

  const handleSubmit = () => {
    const data = { name, userId: user?.id };
  };

  return (
    <div>
      <h4>Create A Group</h4>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="group name..."
        />
        <button onClick={handleSubmit}>Create group</button>
      </div>
    </div>
  );
}

export default CreateGroup;
