import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { prisma } from '@/lib/db';
import { NewNameForm } from './NewNameForm';
import { NewPasswordForm } from './NewPasswordForm';

interface ConfigProps {
  params: Promise<{ id: string }>;
}

const Config: React.FC<ConfigProps> = async ({ params }) => {
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id: id } });

  return (
    <div className="my-8 px-2 sm:px-4 lg:px-20">
      <Tabs defaultValue="name" className="max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="name">Nome</TabsTrigger>
          <TabsTrigger value="password">Senha</TabsTrigger>
        </TabsList>

        <TabsContent value="name">
          <NewNameForm user={user} />
        </TabsContent>

        <TabsContent value="password">
          <NewPasswordForm user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Config;
