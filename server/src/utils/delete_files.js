import fs from "fs"

export const deleteFiles = (req, model, types, isDelete, withIds) => {
    if (!withIds) {
        model = req[model]
    }
    if (!model) return;

    var folder;

    for (let key in types) {

        if (((req.files && req.files[key]) || isDelete) && model) {
            if (model[key]) {


                if (types[key] == 'array') {

                    model[key].forEach((v) => {

                        if (fs.existsSync(v)) {
                            fs.unlink(v, (error) => {
                                if (error) console.log("error");
                                else console.log("deleted");
                            })
                        }
                    })
                } else {



                    if (fs.existsSync(model[key])) {
                        fs.unlink(model[key], (error) => {
                            if (error) console.log("error");
                            else console.log("deleted");
                        })
                    }
                }
            }

        }
    }
}