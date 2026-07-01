// reviews related
export const getReviews = async () => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reviews`);
    const dataResponse = await req.json();
    return dataResponse;
}

// Properties related

export const getAllProperties = async () => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties`);
    const dataResponse = await req.json();
    return dataResponse;
}

export const propertiesById = async (userId) => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/properties/${userId}`);   
    const Res = await req.json();
    return Res;
}

export const getFeaturedProperties = async () => {
    const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/featuredProperties`);
    const dataResponse = await req.json();
    return dataResponse;
}