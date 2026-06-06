interface Team {
  name: string;
  people: Person[];
}

interface Person {
  id: string;
  image: string;
  name: string;
  role: string;
}

const TEAM: Team[] = [
  { name: "Product", people: [] },
  { name: "UI/UX", people: [] },
  { name: "Backend", people: [] },
  { name: "Frontend", people: [] },
];

const Page = () => {
  return (
    <div className="">
      <section className="w-full">
        <div className="grid h-screen place-items-center">
          <h1 className="text-9xl font-bold">The Team</h1>
        </div>
      </section>
      <section className="py-5 sm:py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-y-4">
          <div className="text-center">
            <h3 className="text-4xl font-medium"></h3>
            <p className="text-sm text-gray-400"></p>
          </div>
          <div className="w-full space-y-6">
            {TEAM.map((team) => (
              <div key={team.name} className="w-full space-y-2">
                <h3 className="text-2xl font-semibold">{team.name}</h3>
                <div className="w-full space-y-2">
                  {team.people.map((person) => (
                    <div key={person.id} className="w-full space-y-2">
                      <h3 className="text-lg font-medium">{person.name}</h3>
                      <p className="text-sm text-gray-400">{person.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
