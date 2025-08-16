import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface ConfigTabProps {
  value: string;
  label: string;
  content: JSX.Element;
}

interface TabProps {
  allTabs: ConfigTabProps[];
  value: string;
  setValue: (value: string) => void;
}

const MultipleTabs = ({ allTabs, value, setValue }: TabProps) => {
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList className="w-fit px-5 md:px-0">
        {allTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {allTabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MultipleTabs;
