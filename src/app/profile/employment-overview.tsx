'user client'

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmployeeResponse } from "@/types/employee";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import Cookies from "js-cookie";

type Props = {
  employeeData?: EmployeeResponse;
    onUpdate: () => void;
};
const EmploymentOverview = ({ employeeData, onUpdate }: Props) => {
    const [contractType, setContractType] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    if (employeeData?.employee) {
        if (employeeData.employee.contract_type) setContractType(employeeData.employee.contract_type);
    }
    }, [employeeData?.employee]);




    const [openBank, setOpenBank] = useState(false)
    const [openDep, setOpenDep] = useState(false)
    const [openPos, setOpenPos] = useState(false)
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const [bank, setBank] = useState<{ name: string; code: string }[] | null>(null);

    const [depPosData, setDepPosData] = useState<DepartmentPosition[]>([]);
    const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
    const [positions, setPositions] = useState<DepartmentPosition[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<DepartmentPosition | null>(null);

    type DepartmentPosition = {
        id_department: string;
        Department: string;
        id_position: string;
        Position: string;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
            setIsLoading(true);
            const resBank = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank`, {
                headers: {
                "Authorization": `Bearer ${Cookies.get("token")}`,
                "Content-Type": "application/json"
                }
            })
            const resDepPos = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/department-position`, {
                headers: {
                "Authorization": `Bearer ${Cookies.get("token")}`,
                "Content-Type": "application/json"
                }
            })
    
            if (!resBank.ok) throw new Error("Failed to fetch bank")
            const dataBank = await resBank.json()
            setBank(dataBank)

            if (!resDepPos.ok) throw new Error("Failed to fetch Department & Position")
            const dataDepPos: DepartmentPosition[] = await resDepPos.json();

            setDepPosData(dataDepPos);
            const uniqueDepartments = Array.from(
                new Map(
                    dataDepPos.map(item => [item.id_department, { id: item.id_department, name: item.Department }])
                ).values()
                );
            setDepartments(uniqueDepartments);
            } catch (error) {
            console.error("Error fetching data:", error)
            } finally {
                setIsLoading(false);
            }
        }
    
        fetchData()
        }, []
    )
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

    const handleSelectDepartment = (dep: string) => {
        setSelectedDepartment(dep);
        setPositions(depPosData.filter(d => d.id_department === dep));
        setSelectedPosition(null); // reset position
    };
    // const handleSelectDepartment = (depName: string) => {
    //     setSelectedDepartment(depName);
    //     // Filter posisi berdasarkan nama department
    //     const filteredPositions = depPosData.filter(d => d.Department === depName);
    //     setPositions(filteredPositions);
    //     setSelectedPosition(null); // reset posisi

    //     // Ambil id_department dari data depPosData yang pertama cocok dengan department name
    //     const dep = depPosData.find(d => d.Department === depName);
    //     setSelectedDepartmentId(dep ? dep.id_department : null);
    // };

    // const handleSelectDepartment = (dep: string) => {
    //     setSelectedDepartment(dep);
    //     setPositions(depPosData.filter(d => d.Department === dep));
    //     setSelectedPosition(null); // reset position
    // }; 
    useEffect(() => {
        if (employeeData && depPosData.length > 0 && bank) {
            // Set Department & Position
            const department = depPosData.find(dep => dep.id_department === employeeData.department_id);
            if (department) {
                setSelectedDepartment(department.id_department);
                const filteredPositions = depPosData.filter(d => d.Department === department.Department);
                setPositions(filteredPositions);

                const position = filteredPositions.find(pos => pos.id_position === employeeData.employee.position_id);
                if (position) {
                    setSelectedPosition(position);
                }
            }

            // Set Bank
            const foundBank = bank.find(b => b.code === employeeData.employee.bank_code); // assuming bank_id is the code
            if (foundBank) {
            setSelectedBank(foundBank.code);
            }
        }
    }, [employeeData, depPosData, bank]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const handleSubmitForm = async () => {
        setLoading(true);
        setError(false);
        setSuccess(false);

        try {
            const form = document.getElementById("employeeForm") as HTMLFormElement;
            const formData = new FormData(form);
            if (selectedBank) formData.append("bank_code", selectedBank);
            if (selectedPosition?.id_position)
                formData.append("position_id", selectedPosition.id_position.toString());
            if (selectedDepartmentId)
                formData.append("department_id", selectedDepartmentId);
            console.log("Submitting data:", Object.fromEntries(formData.entries()));   
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/${employeeData?.employee.employee_id}?_method=PATCH`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("token")}`,
                        // Jangan tambahkan Content-Type manual di sini!
                    },
                    body: formData,
            });

            const responseData = await response.json();
            console.log("Response:", responseData);

            if (!response.ok) throw new Error("Gagal submit");

            setSuccess(true);
        } catch (err) {
            console.error("Submit error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    const [isDialogAOpen, setDialogAOpen] = useState(false);
    const handleOkClick = async () => {
        onUpdate(); // panggil fetchData() di parent
        setDialogAOpen(false)
        setSuccess(false); // reset state jika perlu

    };
    return(
         <Card className="flex mr-[20px] gap-[15px] rounded-[15px] border border-black/15 bg-white shadow-[0px_2px_2px_0px_rgba(0,0,0,0.25)] overflow-hidden">
            <div className="flex mx-[20px] justify-between">
                
                <p className="justify-center text-lg font-medium whitespace-nowrap">Employment Overview</p>
                
                
            </div>
            <div className="flex mx-[20px] gap-[10px]">
                
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Department</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.department_name ?? "-"}</span> 
                </div>
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Position</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.position_name ?? "-"}</span> 
                </div>
            </div>
            <div className="flex mx-[20px] gap-[10px]">
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Bank</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.bank_name ?? "-"}</span> 
                </div>
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Account Number</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.employee.account_number ?? "-"}</span> 
                </div>
            </div>
            <div className="flex mx-[20px] gap-[10px]">
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Salary</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">IDR {employeeData?.employee.salary ?? "-"}</span> 
                </div>
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Contract Type</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.employee.contract_type ?? "-"}</span> 
                </div>
            </div>
            <div className="flex mx-[20px] gap-[10px]">
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Join Date</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.employee.join_date ?? "-"}</span> 
                </div>
                <div className="flex flex-col flex-1 gap-[8px]">
                    <Label>Exit Date</Label>
                    <span className="text-gray-600 border border-neutral-300 rounded-md px-4 py-3 overflow-hidden">{employeeData?.employee.exit_date ?? "-"}</span> 
                </div>
            </div>
        </Card>
    
    );
}

export default EmploymentOverview;