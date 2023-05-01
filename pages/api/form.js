export default async function handler(req, res) {

    // Get data submitted in request's body.
    const {identifier} = req.query;
    console.log(identifier, 'identifier');
    const profileApi = `${process.env.BASE_API_URL}profile?key=${process.env.BASE_API_KEY}&steam_id=${identifier}&url=${identifier}`;
    const profileResponse = await fetch(profileApi);
    const data = await profileResponse.json();

    console.log(data, 'data');

    if (profileResponse.status === 404) {
        return res.status(404).json({error: true, message: 'Profile or User not found'});
    }

    if (profileResponse.status !== 200) {
        return res.status(500).json({error: true, message: 'Something went wrong'});
    }

    if (profileResponse.status === 200) {
        return res.status(200).json(data);
    }

}
