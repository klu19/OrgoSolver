import React, { Fragment, useState } from "react";

const InputTodo = () => {
    const [starting_material, setStartingMaterial] = useState("");
    const [final_product, setFinalProduct] = useState("");

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { starting_material, final_product };
            const response = await fetch("http://localhost:5000/todos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/";
        
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center mt-5">Pern Todo List</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <div className="form-group mr-3">
                    <label>Starting Material</label>
                    <input
                        type="text"
                        className="form-control"
                        value={starting_material}
                        onChange={e => setStartingMaterial(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Final Product</label>
                    <input
                        type="text"
                        className="form-control"
                        value={final_product}
                        onChange={e => setFinalProduct(e.target.value)}
                    />
                </div>
                <button className="btn btn-success align-self-end ml-3">Add</button>
            </form>
        </Fragment>
    );
};

export default InputTodo;
