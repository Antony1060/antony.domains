import styled from "styled-components";
import DomainTable from "./DomainTable";
import Navbar from "./Navbar";


const PageContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
`

const ContentContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 1000px;
    max-width: 100vw;
    padding: 2rem;
    text-align: center;
`

const App = () => {
    return (
        <PageContainer>
            <ContentContainer>
                <Navbar />
                <DomainTable />
            </ContentContainer>
        </PageContainer>
    )
}

export default App;