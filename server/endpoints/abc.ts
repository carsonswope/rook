class Ctrl {
// simple endpoint
  getAbc =  async (req, res) => {
    return res.status(200).json({response: 'abc poop'});
  }
}

export default Ctrl;