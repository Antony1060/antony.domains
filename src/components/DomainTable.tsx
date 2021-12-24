import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";

type CloudflareZone = {
    name: string,
    status: string,
}

type ApiResponse = {
    status: number,
    lastUpdated: number,
    lastUpdatedFormat: string,
    domains: CloudflareZone[]
}

const DomainsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 100%;
    gap: 2rem;
    padding: 2rem;
    text-align: center;
`

const DomainContainer = styled.a`
    position: relative;
    flex-basis: 40%;
    display: flex;
    background-color: #2e2e2e;
    height: 4rem;
    width: fit-content;
    min-width: 20rem;
    justify-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    font-size: 1.2rem;
    color: white;
    text-decoration: none;
    border-radius: 4px 4px 0 0;

    &:hover {
        text-decoration: underline;
    }
`

const DomainStatusBar = styled.div<{ status: string }>`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.4rem;
    background-color: ${p => p.status === "active" ? '#5dde59' : p.status === "invalid" ? "#deca59" : '#DE5959'};
`

const Domain: FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { status: string }> = ({ status, children, ...props }) => {
    return (
        <DomainContainer {...props}>
            {children}
            <DomainStatusBar status={status} />
        </DomainContainer>
    )
}

const Header = styled.div`
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    gap: 1rem;
    font-size: 1.2rem;
`

const StatusExplanations = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4rem;

    span {
        width: 2rem;
        height: 6px;
        border-radius: 2px;
        position: relative;
    }

    span:hover div {
        display: block;
    }

    span:nth-child(1) {
        background-color: #5dde59;
    }

    span:nth-child(2) {
        background-color: #deca59;
    }

    span:nth-child(3) {
        background-color: #DE5959;
    }
`

const Tooltip = styled.div`
    position: absolute;
    left: -4rem;
    top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);
    width: 10rem;
    padding: 0.4rem;
    font-size: 0.8rem;
    border-radius: 6px;
    display: none;
    z-index: 2;
`

const Footer = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
`

const Version = styled.a`
    text-decoration: none;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    &:hover {
        color: white;
        text-decoration: underline;
    }
`

const TooltipedSpan: FC<{ tooltip: string }> = ({ tooltip }) => (
    <span>
        <Tooltip>{tooltip}</Tooltip>
    </span>
)

const DomainTable = () => {
    const [ domains, setDomains ] = useState<CloudflareZone[]>([]);
    const [ lastUpdated, setLastUpdated ] = useState("");

    // if these domains exist, they will be displayed in this order
    const priority = ["antony.red", "antony.cloud", "antony.contact", "antony.wiki", "antony.domains", "antony.cash", "fuckcors.app"];

    useEffect(() => {
        axios.get("https://get.antony.domains").then(({ data: { lastUpdatedFormat, domains } }: { data: ApiResponse }) => {
            // adds every zones in priority first
            const final: CloudflareZone[] = priority.map(domain => domains.find(z => z.name === domain)).filter(domain => domain) as CloudflareZone[];
            // add every other zone
            final.push(...domains.filter(domain => !final.find(z => z === domain)));

            setDomains(final);
            setLastUpdated(lastUpdatedFormat)
        });
    }, [])

    return (
        <DomainsContainer>
            <Header>
                <span style={{ fontSize: "2rem" }}>My Domains {domains.length && `(${domains.length})`}</span>
                <span>This list is automatically updated</span>
                {lastUpdated && <span style={{ color: "rgba(255, 255, 255, 0.6)" }}>Last updated {lastUpdated}</span>}
                <StatusExplanations>
                    <TooltipedSpan tooltip="Domain is registered and content is accessible"></TooltipedSpan>
                    <TooltipedSpan tooltip="Domain is registed but there are issues displaying it's content"></TooltipedSpan>
                    <TooltipedSpan tooltip="Domain is not registered yet"></TooltipedSpan>
                </StatusExplanations>
            </Header>
            {domains.length ?
                domains.map(domain => <Domain key={domain.name} href={`https://${domain.name}`} status={domain.status} target="_blank">{domain.name}</Domain>)
            :
                <h1 style={{ flexBasis: "100%" }}>Loading...</h1>
            }
            <Footer>
                <Version href={process.env.REPOSITORY_URL ?? '#'}>
                    Verison {process.env.COMMIT_REF?.substring(0, 7) ?? 'development'}
                </Version>
            </Footer>
        </DomainsContainer>
    )
}

export default DomainTable;