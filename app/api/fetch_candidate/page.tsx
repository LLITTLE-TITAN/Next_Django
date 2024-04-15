import { useQuery, gql } from '@apollo/client';
export default function page({
    searchParams,
}: {
    searchParams?: {
        offset?: string;
        limit?: string;
    };
}) {
    const offset = searchParams?.offset || 0;
    const limit = Number(searchParams?.limit) || 50;
    const GET_DATA = gql`
    query {
    candidates(offset:${offset},limit:${limit}) {
        id
        name
        email
        phone 
    }
    }
    `;
    const { loading, error, data: candidatesData } = useQuery(GET_DATA);
    return candidatesData;
}