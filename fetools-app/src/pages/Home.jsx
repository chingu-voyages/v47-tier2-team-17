import ToolHeaderSection from '../components/ToolsLayout/ToolHeaderSection';
import GoDeeper from '../components/ToolsLayout/GoDeeper';
import ToolHeading from '../components/ToolsLayout/ToolHeading';
import TabSwitcher from '../components/TabSwitcher';
import PageSection from '../components/PageLayout/PageSection';

function TestContent1() {
  return <p>Test Content 1</p>;
}

function TestContent2() {
  return <p>Test Content 2</p>;
}

function TestContent3() {
  return <p>Test Content 3</p>;
}

function Home() {
  const linksData = [
    {
      url: 'https://en.wikipedia.org/wiki/Gabe_Newell',
      textValue: 'Dummy Link 1',
    },
    {
      url: 'https://en.wikipedia.org/wiki/SteamOS',
      textValue: 'Dummy Link 2',
    },
    {
      url: 'https://en.wikipedia.org/wiki/Half-Life:_Alyx',
      textValue: 'Dummy Link 3',
    },
  ];

  return (
    <main className="flex-col mt-8 sm:mt-12 lg:mt-20">
      <PageSection title="Options" icon="tune">
        <p>Here is the content.</p>
      </PageSection>

      <ToolHeaderSection>
        <ToolHeading
          title="Tool title"
          tagline="
        Tool tag line Tool tagline Tool tagline Tool tagline Tool tagline Tool tagline Tool tagline"
        />
        <ToolHeading
          title="Tool title"
          tagline="
        Tool tag line Tool tagline Tool tagline Tool tagline Tool tagline Tool tagline Tool tagline"
        />
      </ToolHeaderSection>

      <TabSwitcher buttons={['rem', 'em', 'px']}>
        <TestContent1 />
        <TestContent2 />
        <TestContent3 />
      </TabSwitcher>

      <GoDeeper linksData={linksData} />

    </main>
  );
}

export default Home;
