import React, { createContext, useEffect, useState } from 'react';
import CategoryService from '../services/CategoryService';

export const CategoryContext = createContext(null);

export function CategoryContextProvider(props) {
    const [ subcategories, setSubcategories] = useState({})
    const [ headcategories, setHeadcategories] = useState({})
    
    useEffect(() => {
        let hcs = {}, scs = {};

        CategoryService.getAllHeadCategories()
            .then(res => {
                res.data.forEach(hc => {
                    hcs[hc.id] = hc;
                })
                setHeadcategories(hcs)
            })
            .catch(err => console.log(err))

        CategoryService.getAllSubCategories()
            .then(res => {
                res.data.forEach(sc => {
                    scs[sc.id] = sc;
                })
            })
            .catch(err => console.log(err))

    }, [])

    const getHeadFromSub = (sub_id) => {
        return subcategories[sub_id].head_category;
    }

    const getHead = (head_id) => headcategories[head_id];

    const contextValue = { headcategories, subcategories, getHeadFromSub, getHead };

    return (
        <CategoryContext.Provider value={contextValue}>{props.children}</CategoryContext.Provider>
    )
}
