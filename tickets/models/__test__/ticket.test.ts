import { Ticket } from "../ticket";

it("Implementa control optimizado de concurrencia", async() => {

    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123"
    });

    await ticket.save();

    const ticket1 = await Ticket.findById(ticket.id);
    const ticket2 = await Ticket.findById(ticket.id);

    ticket1!.set({ price: 10 });
    ticket2!.set({ price: 15 });

    await ticket1!.save();

    try {
        await ticket2!.save();
    } catch (error) {
        return;
    }

    throw new Error("No se puede alcanzar este punto");
})

it("Incrementar el numero de version en multiples intentos de guardar", async () => {

    const ticket = Ticket.build({
        title: "concert",
        price: 5,
        userId: "123"
    });

    await ticket.save(); // por defecto al guardar un documento debe tener como version 0

    expect(ticket.version).toEqual(0);

    await ticket.save(); 
    expect(ticket.version).toEqual(1);

    await ticket.save(); 
    expect(ticket.version).toEqual(2);
})