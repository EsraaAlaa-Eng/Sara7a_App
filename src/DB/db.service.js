export const findOne = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return await model.findOne(filter).select(select).populate(populate)
}



export const findById = async ({ model, id = "", select = "", populate = [] } = {}) => {
    return await model.findById(id).select(select).populate(populate)
}


export const find = async ({ model, filter = {}, select = "", populate = [] } = {}) => {
    return await model.find(filter).select(select).populate(populate)
}


export const create = async ({ model, data = [{}], option = { validateBeforeSave: true } }) => {
    return await model.create(data, option)
}


export const updateOne = async ({ model, filter = {}, data = {}, option = { runValidators: true } }) => {
    return await model.updateOne(filter, data, option)
}

export const findOneAndUpdate = async ({
    model,
    filter = {},
    data = {},
    select = "",
    populate = [],
    option = { runValidators: true, new: true }    //Q
} = {}) => {
    return await model.findOneAndUpdate(
        filter,
        {
            ...data,
            $inc: { __v: 1 },
        }, option).select(select).populate(populate)

}

export const deleteOne = async ({
    model,
    filter = {},
} = {}) => {
    return await model.deleteOne(  filter )

}
