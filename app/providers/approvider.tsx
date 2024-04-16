import { createContext, useEffect, useState } from 'react'
export const AppContext = createContext<any>({})

export const AppProvider = (props: any) => {
  const store: any = {}
  const [offset,setOffset]=useState(0); 
  const [limit,setLimit]=useState(50); 
   

  return <AppContext.Provider value={{offset,setOffset,limit,setLimit      }}>{props?.children}</AppContext.Provider>
}
