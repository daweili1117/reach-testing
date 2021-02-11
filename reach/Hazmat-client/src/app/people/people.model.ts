export class PeopleInfo {
    PersonID;
    ImageUrl;
    FirstName;
    LastName;
    Team;
    Status;
    Role;
    Devices: string[];
    HeartRate;
    BloodPressure;
    HeatIndex;
    SpO2;
    TeamID;
    RoleID;
    HeartRateID;
    BloodPressureID;
    HeatIndexID;
    SpO2ID;
    
}

export class PeopleData{
    FirstName;
    ImageUrl;
    LastActive;
    LastName;
    PersonID;
    Status;
    RoleID;
    TeamID;
    isDelete;
    HeartRateID;
    BloodPressureID;
    HeatIndexID;
    SpO2ID;
}

export class BloodPressure{
    BloodPressureID;
    BPIndex;
    SystolicLowCritical; 
    DiastolicLowCritical;
    ActiveSystolicLow; 
    ActiveDiastolicLow;
    ActiveSystolicHigh;
    ActiveDiastolicHigh; 
}

export class HeartRate {
    HeartRateID;
    HRIndex;
    LowCritical;
    Moderate;
    HighCritical;

}

export class OxygenData {
    SpO2ID;
    AgeGroup;
    LowCritical;
    Low;
    Normal;
    SpO2Index;
}

export interface HeatIndexDetails {
    HeatIndexID;
    Range;
    State;
    HIIndex;
}

export class Team {
    TeamID: number;
    Name: string;
    Description: string;
    Status: boolean;
}

export class DevicesData {
    DeviceID: number;
    IP: string;
    Description: string;
    Type: string;
    Status: boolean;
    BatteryStatus: number;
    isDelete: boolean;
    PersonID: number;
    DeviceDisplayId: any;
}
export class Role {
    RoleID: number;
    Name: string;
    Description: string;
    Status: boolean;
}