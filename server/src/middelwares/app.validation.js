export const appValidator = (schema) => {
    return (req, res, nxt) => {
        let errors=[]
        const { error } = schema.validate({ ...req.body, ...req.query, ...req.params },{abortEarly:false})
        if (error) {
            error.details.forEach(element => {
                errors.push(element.message)
            });
            console.log(error);
            return nxt(new Error(errors,{status:404}))
        }
        nxt()
    }

}