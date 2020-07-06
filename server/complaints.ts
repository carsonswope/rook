// random complaints!
const complaints = [
    'This is the absolute worst trash I have ever seen!',
    'Who dealt this abominable pile of garbage?',
    'It looks like a dog vomited on my Rook hand!',
    'I\'d like to speak to the programmers about the dealing algorithm!',
    'I must seriously question the outright quality of this hand!',
    'I haven\'t had a hand this bad since we were up north in the summer of \'77!',
    'At times like this, one wonders if one has been dealt the all-time worst hand.',
    'I would prefer to put a cigarette out in my eye than to look at this hand!',
    'In the list of events in human history, this hand is in the bottom five.',
    'I\'d like to say something positive about this hand, but I\'ll just sit here and pout like a spoiled baby.',
    'Was Rook invented along with the "stretcher" and "La Machine" as a medieval torture device? Because this hand sure makes it seem that way.',
    'Did someone drop this hand in the barn? Because it sure looks and smells like horse manure!',
    'My day was going pretty well until I saw these cards, now I don\'t even think I\'ll be able to sleep tonight.',
    'Of all the horrible hands I\'ve gotten, this is certainly one of them.',
    'What?! First The Covid-19 Pandemic and now THIS?!',
    'Poop! Poop, poop, poop, poop, poop, poop, poop!',
    'Why do I always get dealt the crow?',
    'This hand smells worse than Highway 7 in West Virginia.',
    'Who\'s chortling over my unfortunate hand?',
    'Hey- all these 2s, 3s and 4s make a rainbow!',
    'Yellow 2?!  That\'s the puke card.',
    'Re-deal!  I only got one color!',
    'Wait a second?  Where was that card hiding?',
    // not really a complaint?
    // 'Are you going to bid or what?  Either pee or get off the pot!',
    'Such poop, such stink.',
]

const getRandomComplaint = (): string => complaints[Math.floor(Math.random() * complaints.length)];

export default getRandomComplaint;