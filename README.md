# Introducing Hive Commons
# What is Hive Commons?

[Hive Commons](http://hivecommons.org) is a grass roots movement intended to give the public a greater voice in industry and politics by using emerging technologies to enable new forms of collective activism.  Originally, I had planned to wait until I had things a bit more organized and polished but after submitting one of the components of the project as a [District0x District Proposal](https://github.com/district0x/district-proposals/issues/3) I’ve had a few people interested in learning more about the grander vision for the project, so I’ve decided to go ahead and start moving things into a more public space. Up until now, the project has only existed in various local notes and powerpoint documents, but I’m now starting to move things [into Github](https://github.com/hivecommons), and have also created a [Reddit](https://www.reddit.com/r/HiveCommons/) and [Slack](https://hivecommons.herokuapp.com)community for people who are interested in the project to gather. 

The goal of Hive Commons is to enable a community of activists to pool their collective resources into a digital [commons](https://en.wikipedia.org/wiki/Commons)that is governed by a blockchain  governance system based on the principles of [Liquid Democracy](https://medium.com/organizer-sandbox/liquid-democracy-true-democracy-for-the-21st-century-7c66f5e53b6f). As the resources within the commons grow and become more valuable, the community will be able to offer access to the commons as leverage for collective bargaining. 

Functionally, Hive Commons will act a bit like a *public cartel*, ensuring that the public goods within the commons are protected and grow overtime. If successful, this should offer a significantly more *effective solution to Tragedy of the Commons* challenges.  

Imagine if Facebook was more accountable to the public than to its private shareholders and advertising partners? Imagine if collectively we could reward our political representatives contingent on their approval rating? The goal of Hive Commons is to provide a platform for collective activism that will make that a reality. 

# Why is it necessary?	 

Historically collective action has been a highly effective way for communities to bring about societal changes, however, large scale collective action has been elusive as it is incredibly challenging to pull off. Often, the only thing a large group of people can agree on is that they don’t really agree on anything, and without consensus, collective action falls apart because individuals do not have enough leverage to make change by themselves. 

[Representative Democracy](#)(https://en.wikipedia.org/wiki/Representative\_democracy) is so far the most successful form of organized collective action, but there are significant flaws. The first of which is that it relies on violent coercion rather than voluntary association to maintain authority, the second is that by electing representatives, we centralize authority in a relatively small population that is motivated by their own self-interest and subject to economic capture by third-parties. The result is a structure that provides some public benefit, but balances that benefit with private-interests sub-optimally.  Arguably, many democratically governed nations have already devolved into thinly veiled oligopolies, controlled primarily by the interests of a wealthy elite. 

In an ideal world, collective action is voluntary, and consensus is reached without a central authority. Hive Commons enables this type of activist organization, and while not a substitute for traditional governments in the sense that there may always need to be a need for a forceful authority to keep act as peacekeeper, it does offer a less corruptible alternative to representing the desires of a community and a means to realize that desire within the bounds of existing economic and governance systems. 

# How will it work?

Participation in governance and dispute arbitration will require a new cryptographic token, at the time of writing Giveth’s MiniMe extension of the ERC20 Ethereum token standard seems like the best starting point. The token, currently called Honey (HNY), will be used in all voting activities within the community using a voting model based on liquid democracy. Research, discussion, and development of the voting system is being done in the [Hive Democracy](#)(https://github.com/HiveCommons/Hive-Democracy) repository on Github. 

This token must be widely distributed and checks must be put in place to prevent accumulation and centralization of power. There are a number of promising theoretical approaches to this, which should be explored in more detail, but initially the HNY token will have a significant hard-coded supply inflation that is granted as an endowment to  the Hive Commons non-profit  foundation (Note that where exactly this foundation should be established, is still TBD). The foundations purpose will be to ensure that the distribution of HNY tokens does not become centralized over time, the tokens could be issued as bounties for contributions to the commons, or supplied to “proof of individuality” token faucets. In other words the goal of the foundation is to distributed tokens widely and to active community contributors. Eventually this process of redistribution may be possible to automate through smart contracts and the foundation may become obsolete. 

A user friendly interface for participating in the community is critical to the success of the project. The [District0x](https://district0x.io) project appears to be a promising start and much of the functionality they have already built, or plan to build, could serve as the foundation for the [1Hive](https://github.com/HiveCommons/1Hive) community portal. The portal would provide a web3.0 enabled community interface that might look similar to Reddit.com, but allow novel interactions including [funding and curation of initiatives](https://github.com/district0x/district-proposals/issues/3), discussion, governance, and dispute resolution. 
 
The 1Hive community and governance portal will be much more useful if there is some shared community commons to govern. There are a number of resources that would be a good fit for pooling within a commons—software, capital, patents, computation, storage, approval, and even attention. Each resource may require a unique approach to pooling, some of which may be more difficult than others. Hive Commons plans to *focus on enabling pooling of software and capital first*, but the infrastructure needed to support those should overlap significantly with other resources, making it simple to enable new resource types in the future. 

## Pooling Software with Hive Commons

Open Source software is an example of a digital commons, but existing open source software licenses struggle to govern access to software effectively. In fact there is a significant divide within the Open Source software community on how access to the software should be controlled. People are philosophically divided over whether Copyleft licenses are better than Permissive licenses in achieving the community goal of providing a more free and open society.  

A Copyleft style license like the GPL has a viral clause that requires user to license any derivative works under the same license, thereby growing the community commons. The problem is that this mechanism is inflexible and generally not compatible with any sort of commercial application whatsoever. If a company build a product that is 99% new code, and 1% GPL licensed code, the GPL license would require that the 99% must be open sourced and also licensed on the GPL, there is no middle ground for the company to opt to open source 1% of the new code in exchange for usage of the 1%  of the GPL code they are licensing it is an “All or Nothing” proposition. The result is that GPL and other Copyleft licensed projects typically are developed primarily by volunteers in their free time and the project often lack the funding, polish, and utility of more mainstream products. 

In contrast, a Permissive style license like the Apache license, does not have any viral restriction. Users can use the software in commercial applications without worrying about having a specific requirement to give back to the community in anyway. Though in practice, its often the case that in using the application they make improvements and bug fixes as they encounter them. 

The Hive Commons License (HCL) will be a novel open source license based on the GPL, the official legal license still needs to be written and reviewed by legal experts, however, the general idea is that HCL licenses will have to options for compliance. Either license any derivative works under the HCL as you would with the GPL, or give back to the community proportionally to value you received. The second option is intentionally ambiguous and allows for a wide range of interpretations and usage flexibility while still retaining a lesser viral quality. In the event that there is a license dispute over whether the user has met the requirement of giving back proportional the Hive Commons community will use liquid democratic voting implementation to serve as final arbitrator in the dispute. 

This makes it resources within the Hive Commons more accessible to businesses than software licensed under the GPL, but gives activist contributors more assurance that their contributions will have a lasting positive impact on the community as a whole. 

## Pooling Capital with Hive Commons

Ultimately there are far fewer people who can develop software then there are members of the public, so to maximize the network effect of the movement and allow more public participation its also important that everyone has a straightforward way to contribute to the commons. A good way to do that is by funding labor and development efforts of others in order to grow the commons. 

The mechanism must be simple, standardized, and most importantly provide accountability to the community in order to be successful. The platform should enable funders to curate and fund projects, and provide an accountability guarantee in the form of milestone driven development and vesting schedules. 

The [1Hive Funding Platform](https://github.com/district0x/district-proposals/issues/3) district proposal is a good first step towards this goal, with the notable lack of a way for project contributors to fund and vote on the release of additional milestone driven bounties. Once the Hive Democracy voting mechanism is ready, this can easily be added such that anyone may claim a bounty, and then the funders could vote to release the funds. 

This funding platform would enable community members to provide an incentive for developers to initially contribute to the commons, bootstrapping the community until the viral aspect of the HCL licenses begins to take effect and create a positive feedback loop. 

## Who can help?
You can. Hive Commons is a grass-roots organization and everyone who believes in the mission can and should participate in the realization of the communities shared goal. Whether that means joining the conversation and spreading the ideas, or getting more active in development and infrastructure. Here are some specific skills that would be extremely helpful to the project at it current stage. 

### Solidity Development
To realize the vision of Hive Commons the community will need to build, audit, and, test several smart contracts. Tokens, Voting and Arbitration, Escrow, Bounties, and Reserve contracts are all core components of the project. 

### Web3.0 Frontend Development
The [1Hive community portal](https://github.com/HiveCommons/1Hive) is a web3.0 enabled interface that will enable direct community engagement with Hive Commons. 

### UX and Graphic Design
 Hive Commons goal is to attract a community of users who may not have even heard of cryptocurrency, making the 1Hive portal and community websites and general outward facing elements of the project as friendly as possible will be imperative to the success of the project. 

### Legal Expertise
Decentralized blockchain governance is an emerging area and there are many uncertainties about how it fits into existing laws and regulatory guidelines its important that the project has a strong understanding of the implications of these things are to ensure the long-term success of the project. In the short-term setting up a legal non-profit entity, drafting and reviewing the proposed Hive Commons License for open source developers is mission critical. 

### Not sure you fit in any of those categories?
Even if you don’t have any of the above skillsets, if you want help, I can guarantee that you have something to contribute—Sharing ideas, poking holes in existing  plans, and generally discussion the project are all important contributions as well. 

**So whatever your skillset is, join the community and get involved.** We are on [Github](https://github.com/HiveCommons), [Medium](https://medium.com/hive-commons), [Reddit](https://www.reddit.com/r/HiveCommons/), and [Slack](https://hivecommons.herokuapp.com). 

