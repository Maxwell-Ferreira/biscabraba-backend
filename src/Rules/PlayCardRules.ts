const playCardRules = () => {
  return {
    playedCard: 'required|integer|range:0,2'
  }
}

export default playCardRules;
