# LedgerGuard
This code is part of a project that has been submitted at the hackathon Hackzurich2023 by the LedgerGuard team.

Feel free to have a look at the [video introduction](https://vimeo.com/866510361)

## Inspiration
Reaching consensus is crucial for organizations of any size -- from close-knit local communities to
global intergovernmental organizations. Until now, decision-making was a long-winded and intricate
process in the form of traditional postal elections or in-person voting. These forms of election carry an
inherent physical accessibility disadvantage that may cause people not to use their fundamental right
to vote. Moreover, when peering behind the scenes an election is both resource-intense and error
prone; both organizers and participants need to deal with vast costs, voter fraud and even carbon
footprint.
## What it does
With LedgerGuard we are thrilled to introduce our Blockchain-driven, end-to-end, fully-decentralized
solution for digital election, voting, and referendum. Our solution isn't restricted to a single form of
voting and, through our ‘Ballot Owner’ interface, you can create and determine and customize your
poll’s attributes -- whether that be about nominating the best 5 nominees to Eurovision or the party
one believes should lead the country. Within seconds, you can create a multi-stage poll with either
single or multiple selections and set the time frame to vote. All that remains is to distribute your
voting keys to your future voters and we are done! Completely anonymous, fully secured, accessible
from anywhere, and environment-friendly solution just in a couple of taps.
## How we built it
Our solution utilizes Blockchain's latest advancements to allow entities of any kind, to ensure fraud-
proof, low-cost, sustainable, and accessible polls. We build upon the foundation of Hedera, a
decentralized, proof-of-stake public ledger that offers the basic building blocks to persist immutable,
verifiable and timestamped election data and thus ultimately achieve robust and collusion-resistant
consensus. By modelling key actors (voters and candidates) in the form of custom tokens, we
guarantee properties such as safe, single-use delegation and strictly-gated start and expiry of the
election process.
All this tech is hidden behind an intuitive and familiar web-based wizard. We generate a decentralized
architecture from scratch for every poll. We issue accounts according to the amount of expected
voters. Then, according to amount of polls and selections we generate different customized fungible
tokens and distribute them according to the poll attributes. The act of voting then becomes the act of
transferring a token from a voter account to the chosen candidate. All this happen while smart
contracts ensure that no one is violating the poll's rules. From a users' perspective, they first insert a
private key and then transfer the tokens allocated to him to his favorite candidate, nominee, or too-
hot-to-handle participant.
## Challenges we ran into
Blockchains cater largely to financial scenarios and we had to contend with ill-fitting behavior of (i) the
fee structure levied whenever actions are performed and (ii) the need to explicitly associate recipients
with tokens they use. These hurdles weren't insurmountable since the underlying network allows
customization and fine control e.g. granting retractable allowances and hiding extra actions behind a
facade. Furthermore, whilst the initial onboarding experience is quick and smooth, inevitably things go
wrong and troubleshooting was onerous and challenging since stack traces are often incomplete and
require threading together fragments of information from several sources.