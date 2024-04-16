import { gql } from "@apollo/client";

export const candidate_list = gql`
query {
    candidates(offset:${offset},limit:${limit}) {
        id
        name
        email
        phone 
    }
    }
    `; 
      